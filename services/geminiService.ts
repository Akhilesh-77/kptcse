
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are the "KPT CS Department Assistant". Your tone is professional, helpful, and tech-savvy. 
You provide information about the Computer Science department at KPT.
Key Info:
- HOD: Prof. Parashuram D Talwar (Specializes in Java, Python).
- Location: KPT Polytechnic Campus.
- Courses: Diploma in Computer Science & Engineering.
- Atmosphere: Encouraging, innovation-driven.
If users ask about syllabus or faculty, refer to the sections on the website. 
Be concise and avoid generic AI pleasantries unless necessary. 
Do not share any keys or sensitive data.
`;

export const getGeminiResponse = async (userMessage: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.9,
      },
    });
    return response.text || "I'm sorry, I couldn't process that. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently taking a short break. Please try again in a few minutes.";
  }
};
