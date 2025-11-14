// api/telegram/webhook.js
require('dotenv').config();
const axios = require('axios');
const db = require('../../lib/db');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
if (!TELEGRAM_TOKEN) {
  console.error('Missing TELEGRAM_TOKEN');
}
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

async function tgSend(chatId, text) {
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text });
  } catch (e) {
    console.error('tgSend error', e?.response?.data || e.message);
  }
}

module.exports = async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.message) return res.status(200).send('ok');

    const chatId = body.message.chat.id;
    const text = (body.message.text || '').trim();

    if (!text.startsWith('/pay')) {
      await tgSend(chatId, 'Usage: /pay <amount>. Example: /pay 50');
      return res.status(200).send('ok');
    }

    const parts = text.split(/\s+/);
    const amount = parseFloat(parts[1] || '0');
    if (!amount || amount <= 0) {
      await tgSend(chatId, 'Invalid amount. Usage: /pay <amount>');
      return res.status(200).send('ok');
    }

    const reference = `tg-${chatId}-${Date.now()}`;
    db.createPending(reference, chatId, amount);

    // Build PayHero payload - adjust to PayHero's real API fields
    const payload = {
      channel: process.env.PAYHERO_CHANNEL,
      amount,
      currency: process.env.PAYHERO_CURRENCY || 'KES',
      customer: { id: String(chatId), source: 'TELEGRAM' },
      reference,
      callback_url: `${process.env.PUBLIC_URL}/api/payhero/callback`
    };

    const auth = Buffer.from(`${process.env.PAYHERO_USER}:${process.env.PAYHERO_PASS}`).toString('base64');

    try {
      const phRes = await axios.post(`${process.env.PAYHERO_API}/initiate`, payload, {
        headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
        timeout: 15000
      });

      const data = phRes.data || {};
      if (data.payment_url) {
        await tgSend(chatId, `Open this to pay: ${data.payment_url}`);
      } else {
        await tgSend(chatId, `Payment started. Reference: ${reference}`);
      }

      return res.status(200).send('ok');
    } catch (err) {
      console.error('PayHero call error', err?.response?.data || err.message);
      await tgSend(chatId, 'Failed to start payment. Try again later.');
      return res.status(200).send('ok');
    }
  } catch (err) {
    console.error('webhook error', err);
    return res.status(500).send('error');
  }
};
