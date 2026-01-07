
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  // Always use process.env.API_KEY directly for initialization as per guidelines
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateExamContent = async (prompt: string, modelName: string = 'gemini-3-flash-preview') => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    // response.text is a direct property, not a method
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateJSONContent = async (prompt: string, schema: any, modelName: string = 'gemini-3-flash-preview') => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    // Always trim the response text before parsing as per guidelines
    const jsonStr = (response.text || "").trim();
    return JSON.parse(jsonStr || "{}");
  } catch (error) {
    console.error("Gemini JSON Error:", error);
    throw error;
  }
};

// Common Schemas using Type enum correctly
export const ExamSchema = {
  type: Type.OBJECT,
  properties: {
    duration_seconds: { type: Type.NUMBER },
    totalMaxMarks: { type: Type.NUMBER },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          context: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING, description: "mcq, numerical, text, paragraph, case_based" },
                text: { type: Type.STRING },
                caseText: { type: Type.STRING },
                paragraphText: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctOption: { type: Type.STRING },
                explanation: { type: Type.STRING },
                marks: { type: Type.NUMBER }
              },
              required: ["id", "type", "text", "correctOption", "explanation"]
            }
          }
        },
        required: ["name", "questions"]
      }
    }
  },
  required: ["duration_seconds", "sections"]
};

export const FlashcardSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      front: { type: Type.STRING },
      back: { type: Type.STRING }
    },
    required: ["front", "back"]
  }
};
