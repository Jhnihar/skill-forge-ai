import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = 'gemini-2.0-flash';

export async function callGemini(prompt, { json = false } = {}) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'PUT_MY_KEY_HERE') {
    throw new Error('Gemini API key is missing. Add VITE_GEMINI_API_KEY to your .env file.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: json ? { responseMimeType: 'application/json' } : undefined
  });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (typeof text !== 'string' || !text.trim()) {
      throw new Error('Gemini returned an empty response.');
    }

    if (!json) {
      return text;
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      const cleaned = text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      try {
        return JSON.parse(cleaned);
      } catch (parseError) {
        throw new Error(`Gemini returned invalid JSON: ${parseError.message}`);
      }
    }
  } catch (error) {
    console.error('Gemini request error:', error);
    throw error;
  }
}