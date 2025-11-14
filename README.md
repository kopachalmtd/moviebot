# Moviebot (Next.js + PayHero + Telegram)

## Setup
1. Copy files into a repo.
2. Add posters to `public/` (poster1.jpg, poster2.jpg).
3. Replace FILE_ID placeholders in `data/movies.js` & `pages/api/payhero-callback.js`.
4. Set environment variables in Vercel (see `.env.example`).
5. Deploy to Vercel (link GitHub repo).

## Env vars (Vercel)
PAYHERO_USERNAME, PAYHERO_PASSWORD, PAYHERO_CHANNEL_ID,
TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_CHAT_ID, SITE_BASE_URL

## Notes
- PayHero endpoint used: `https://backend.payhero.co.ke/api/v2/payments`
- Configure PayHero callback to: `https://<your-domain>/api/payhero-callback`
- Use Telegram file IDs to deliver videos (send your file to bot, forward to @FileIDBot).
