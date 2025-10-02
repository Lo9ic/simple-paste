# Simple Paste (Single link, shared)

A super-simple paste app with a single link. Click Save to store text on the server; anyone opening the same link will see the latest saved text. No auth.

## Files
- index.html — single-file UI with Save / Reload / Copy.
- api/paste.js — serverless endpoint for saving/loading the single shared paste.

## How to use (locally)
1. Serve the folder (recommended for fetch to work):
   - Python 3
     python3 -m http.server 8080 -d simple-paste
     # Then open http://localhost:8080/
   - Node (npx serve)
     npx serve simple-paste -l 8080
2. Use the buttons:
   - Save: uploads current text to /api/paste
   - Reload: fetches latest text from /api/paste
   - Copy: copies current text to clipboard

Note: Locally, without KV env vars, the API returns empty and saving will fail. Configure KV for persistence.

## Deploy to Vercel with KV (persistence across users)
1. Create a Vercel KV database (Dashboard → Storage → KV) or Upstash Redis.
2. Set environment variables for the project:
   - KV_REST_API_URL
   - KV_REST_API_TOKEN
   (Alternatively: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN)
3. Deploy to Vercel. The API will use these env vars to persist the text under a single key.

## Notes
- Single shared slot: saving overwrites the previous text.
- No auth: anyone with the link can read and overwrite.
- Buttons: Reload, Save, Copy.
