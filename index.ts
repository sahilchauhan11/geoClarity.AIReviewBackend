
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { runGemini } = require('./gemini');
import { Request, Response, Express } from 'express'; // Import Express type explicitly

dotenv.config();

const app: Express = express(); // Use imported Express type
const PORT: string|number=process.env.PORT||8000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies if needed
}));
app.use(express.json());

interface GeminiRequestBody {
  prompt: string;
}

interface TestRequestBody {
  message: string;
}

app.post('/api/gemini', async (req: Request<{}, {}, GeminiRequestBody>, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const result = await runGemini(prompt);
    res.json({ response: result });
  } catch (error: any) {
    console.error('Gemini Error:', error.message);
    res.status(500).json({ error: 'Failed to generate Gemini response' });
  }
});

app.post('/api/test', (req: Request<{}, {}, TestRequestBody>, res: Response) => {
  const { message } = req.body;
  console.log("Received:", message);
  res.json({ reply: `You sent: ${message}` });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
