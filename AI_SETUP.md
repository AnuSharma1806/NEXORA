# NEXORA SUMMIT BUILD 0919

This is a fresh build generated from the original NEXORA project with the AI chat fixes applied.

## Setup
1. Put your OpenAI key in `.env` as `OPENAI_API_KEY=...`
2. Keep `OPENAI_MODEL=gpt-5.6-luna` unless you intentionally use another supported model.
3. Run `start.bat`.
4. Open `http://localhost:5500/chat.html`.
5. If AI fails, the chat status shows the HTTP/API error instead of hiding it behind a generic demo message.

Never share `.env` or your API key.
