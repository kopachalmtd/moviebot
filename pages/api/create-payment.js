export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  const { amount, phone_number, movie_id, external_reference } = req.body;

  if (!amount || !phone_number || !movie_id || !external_reference)
    return res.status(400).json({ error: "Missing fields" });

  const username = process.env.PAYHERO_USERNAME;
  const password = process.env.PAYHERO_PASSWORD;
  const channel_id = process.env.PAYHERO_CHANNEL_ID;

  const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const resp = await fetch("https://backend.payhero.co.ke/api/v2/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`
      },
      body: JSON.stringify({
        amount,
        phone_number,
        channel_id,
        provider: "m-pesa",
        external_reference
      })
    });

    const data = await resp.json();

    if (!resp.ok) {
      return res.status(500).json({ ok: false, error: data.message });
    }

    return res.json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
