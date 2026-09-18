# NEXORA V9 — AI Fixed V2

## Local test
1. Install Node.js 20+ if needed.
2. Set your OpenAI API key as an environment variable named `OPENAI_API_KEY`.
3. Run `node server.mjs` (or double-click `start.bat` on Windows).
4. Open `http://localhost:5500`.

Do **not** put the API key in HTML/JS or commit it to GitHub.

## Vercel
Import this project into Vercel and add `OPENAI_API_KEY` under Project Settings → Environment Variables, then redeploy.
The frontend uses `/api/chat`, `/api/analyze-resume`, and `/api/tts`. The chat client has a 20-second timeout and falls back to demo mode instead of hanging the page.

The default chat model is `gpt-5.6-luna`; you can override it with `OPENAI_MODEL`.


AI CHAT FREEZE FIX: Removed the MutationObserver feedback loop that could make chat.html show "Page Unresponsive".
