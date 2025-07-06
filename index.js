import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Load from .env
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

// Init Telegram
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Escape HTML special characters
const escapeHtml = (unsafe) =>
  unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// Help instructions (only shown with /start and /help)
const instructions = `📌 *How to use this bot:*
- Use \`/code <your request>\` to generate code
- Example: \`/code Create a Python function to check prime numbers\`
- Keep your request under 500 characters
- Use \`/help\` to see this message again`;

// /start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `👋 Welcome to *Gemini Code Bot*!\n\n${instructions}`, {
    parse_mode: "Markdown",
  });
});

// /help command
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, instructions, {
    parse_mode: "Markdown",
  });
});

// /code command
bot.onText(/\/code (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1].trim();

  if (query.length > 500) {
    return bot.sendMessage(chatId, "❗ Query too long. Please keep it under 500 characters.");
  }

  try {
    await bot.sendMessage(chatId, "⚡ Generating code...");

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: "user",
          parts: [{ text: `Write clean, commented code for: ${query}` }],
        },
      ],
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    const chunks = text.match(/[\s\S]{1,4000}/g) || [text];

    for (const chunk of chunks) {
      const escaped = escapeHtml(chunk);
      await bot.sendMessage(chatId, `<pre><code>${escaped}</code></pre>`, {
        parse_mode: "HTML",
      });
    }
  } catch (error) {
    console.error("Gemini API Error:", error);

    let errorMsg = "❌ Failed to generate code.";
    if (error instanceof Error) {
      errorMsg += `\n\nReason: ${error.message}`;
    } else if (typeof error === "object") {
      errorMsg += `\n\nDetails: ${JSON.stringify(error, null, 2)}`;
    }

    await bot.sendMessage(chatId, errorMsg);
  }
});
