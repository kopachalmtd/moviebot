import { sendTelegramFile, sendTelegramMessage } from "../../lib/telegram";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Not Allowed" });

  const body = req.body;

  console.log("PAYHERO CALLBACK:", body);

  const status = body.status || body.transaction_status;
  const reference = body.external_reference;
  const amount = body.amount;

  if (!reference) {
    return res.json({ ok: true });
  }

  // Example: movie_m1_17107039239
  const parts = reference.split("_");
  const movieId = parts[1];

  const movies = {
    m1: "FILE_ID_1",
    m2: "FILE_ID_2",
    m3: "FILE_ID_3"
  };

  if (status === "SUCCESS") {
    const file_id = movies[movieId];

    // Send movie to admin (or user if you set user_id)
    await sendTelegramFile(
      process.env.TELEGRAM_ADMIN_CHAT_ID,
      file_id,
      `Payment successful for ${reference}`
    );
  } else {
    await sendTelegramMessage(
      process.env.TELEGRAM_ADMIN_CHAT_ID,
      `Payment FAILED for ${reference}\nStatus: ${status}`
    );
  }

  res.json({ ok: true });
}
