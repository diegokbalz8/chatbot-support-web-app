const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const apiKey = process.env.OPENROUTER_API_KEY;
// Log the API key for debugging (remove after confirming)
console.log('API Key:', apiKey);  // Just for debugging

if (!apiKey) {
  console.error('API key not found in .env file');
  process.exit(1);  // Exit the app if no API key is found
}

app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Chat endpoint
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // or another model you tested with
        messages: [
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const botReply = data?.choices?.[0]?.message?.content ?? '[No reply]';

    res.json({ reply: botReply });

  } catch (error) {
    console.error('Error contacting OpenRouter:', error);
    res.status(500).json({ reply: '[Error contacting AI service]' });
  }
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
