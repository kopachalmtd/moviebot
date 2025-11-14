// lib/telegram.js
export async function sendTelegramMessage(chat_id, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("Missing TELEGRAM_BOT_TOKEN");
  return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id, text })
  });
}

export async function sendTelegramFile(chat_id, file_id, caption = "") {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("Missing TELEGRAM_BOT_TOKEN");
  // We use sendVideo here — change to sendDocument/sendAudio if needed.
  return fetch(`https://api.telegram.org/bot${token}/sendVideo`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id, video: file_id, caption })
  });
}
