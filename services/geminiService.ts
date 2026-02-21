import { GoogleGenAI } from "@google/genai";

// CAUTION: In a real production app, never expose API keys in frontend code.
// This should be proxied through your backend. 
// For this demo, we assume the environment variable is available or we'd use a proxy.
// We will use the provided instruction's pattern.
const apiKey = process.env.API_KEY || ''; 

let ai: GoogleGenAI | null = null;

try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (error) {
  console.error("Failed to initialize Gemini Client", error);
}

export const generateJobDescription = async (jobTitle: string, companyName: string): Promise<string> => {
  if (!ai) {
    return "AI service is not configured (API Key missing). Please write the description manually.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `Write a professional and attractive job description for a "${jobTitle}" position at "${companyName}". 
    Keep it concise (under 150 words). 
    Include a brief intro, key responsibilities, and desired mindset. 
    Do not use markdown formatting, just plain text paragraphs.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description. Please try again.";
  }
};