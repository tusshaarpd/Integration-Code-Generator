import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MODEL_GENERATOR, GENERATOR_PROMPT_TEMPLATE } from "../constants";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface StreamCallback {
  (text: string): void;
}

export const generateIntegrationCode = async (
  apiDoc: string,
  language: string,
  onChunk: StreamCallback
): Promise<string> => {
  try {
    const prompt = GENERATOR_PROMPT_TEMPLATE
      .replace('{API_DOC_URL}', apiDoc)
      .replace('{LANGUAGE}', language);

    const result = await ai.models.generateContentStream({
      model: MODEL_GENERATOR,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      config: {
        // High thinking budget for complex coding tasks to ensure quality
        thinkingConfig: { thinkingBudget: 16384 },
      }
    });

    let fullText = '';

    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      const text = c.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
    }

    return fullText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
