require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const apiKey = process.env.GEMINI_API_KEY || 'YOUR_DEFAULT_KEY';

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
    You are a teacher assistant. Evaluate the user's input,
    provide feedback, and grade them strictly out of 10
    based on the subject and question. Also check the fact
    claims in history or real life related answers.
  `
});

function formatResponseToHTML(responseText) {
  return responseText
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\* (.*?)\n/g, '<ul><li>$1</li></ul>')
    .replace(/\n\* (.*?)/g, '<li>$1</li>');
}

app.get('/', async (req, res) => {
  try {
    const topic = "History";
    const question = "What were the key causes of the American Revolution?";
    const answer = "It was caused by political, economic, and ideological factors.";
    const prompt = `Topic: ${topic}; Question: ${question}; Answer: ${answer}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const formattedResponse = formatResponseToHTML(responseText);

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Teacher Assistant</title>
          <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              .response { background: #f4f4f4; padding: 10px; border-radius: 5px; }
          </style>
      </head>
      <body>
          <h1>AI Evaluation</h1>
          <h2>Topic: ${topic}</h2>
          <h3>Question: ${question}</h3>
          <h3>Your Answer: ${answer}</h3>
          <div class="response">
              ${formattedResponse}
          </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("<h1>Error</h1><p>An error occurred while processing your request.</p>");
  }
});

app.post('/evaluate', async (req, res) => {
  try {
    const { topic, question, answer } = req.body;
    const prompt = `Topic: ${topic}; Question: ${question}; Answer: ${answer}`;
    const result = await model.generateContent(prompt);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});