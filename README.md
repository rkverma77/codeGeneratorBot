# 🤖 Gemini Code Generator Bot for Telegram

A Telegram bot powered by Google's Gemini API that generates clean, commented code in various programming languages based on natural language prompts.

---

## 📌 Features

- Generate code with simple natural language instructions
- Built-in commands: `/start`, `/help`, `/code`
- Escapes special HTML characters for safe Telegram rendering
- Handles large code responses by chunking messages

---

## 📥 Installation

### 1. Clone the repository

```bash
git clone https://github.com/rkverma77/codeGeneratorBot.git
cd codeGeneratorBot

```
### 2. Install dependencies
```bash
npm install
```

### 3. Create .env file
```.env
TELEGRAM_TOKEN=your_telegram_bot_token
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```
You may change the model to gemini-1.5-pro or gemini-2.5-flash if your API key supports it.

### 4. Run the Bot
```bash
node index.js
```

## 🔧 Technologies Used
- Node.js
- node-telegram-bot-api
- @google/genai
- dotenv



