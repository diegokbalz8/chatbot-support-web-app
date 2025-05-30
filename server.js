// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Optional, not used in this file unless needed
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname)));

const apiKey = process.env.OPENROUTER_API_KEY;
console.log('API KEY loaded:', apiKey ? '[OK]' : '[MISSING]'); // Debug line

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
  model: "anthropic/claude-3-haiku",  // or claude-3-sonnet
  messages: [
    { role: "user", content: userMessage }
  ]
})
    });

    const data = await response.json();
    console.log("API raw response:", JSON.stringify(data, null, 2));

    const botReply = data?.choices?.[0]?.message?.content ?? '[No reply or invalid response]';
    res.json({ reply: botReply });

  } catch (error) {
    console.error('Error contacting OpenRouter:', error);
    res.status(500).json({ reply: '[Error contacting AI service]' });
  }
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
