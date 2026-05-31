import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

let model: GenerativeModel | null = null;

if (API_KEY) {
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

export const getAIResponse = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) => {
  if (!model) {
    return "Gemini API Key not found. Please set VITE_GEMINI_API_KEY in your .env file.";
  }

  try {
    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};
