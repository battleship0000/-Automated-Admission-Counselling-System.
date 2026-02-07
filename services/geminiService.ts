
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  // Fix: Removed the constructor-based initialization to ensure a fresh instance is created per request
  // following the recommended practice for dynamically injected API keys.

  async analyzeEnquiryTrend(enquiries: any[]) {
    try {
      // Fix: Always use named parameter for apiKey and use process.env.API_KEY directly.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze the following university admission enquiries and provide a short summary of trends (which courses are popular, what's the average wait time, and one recommendation for the admin). 
      Data: ${JSON.stringify(enquiries.slice(-10))}`;

      // Fix: Use ai.models.generateContent directly.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      // Fix: Access response.text property directly.
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Unable to analyze trends at this time.";
    }
  }

  async getCounsellingTips(courseName: string) {
    try {
      // Fix: Always use named parameter for apiKey and use process.env.API_KEY directly.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Fix: Use ai.models.generateContent directly with appropriate model and configuration.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide 3 quick talking points for a counsellor speaking to a student interested in ${courseName}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      // Fix: Access response.text property directly.
      return JSON.parse(response.text || '[]');
    } catch (error) {
      return ["Focus on curriculum", "Mention placement records", "Discuss faculty expertise"];
    }
  }
}

export const geminiService = new GeminiService();
