import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GroundingChunk } from "../types";

// Helper to remove header from base64 string
const cleanBase64 = (b64: string) => b64.split(',')[1];

export const analyzeSkinImage = async (base64Image: string): Promise<string> => {
  // Use process.env.API_KEY as requested.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key not configured. Please add 'API_KEY' to your Vercel Environment Variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Analyze this skin image. 
    1. Provide a PRELIMINARY classification of what the condition *might* be. 
    2. List 3 potential common causes.
    3. State clearly that this is NOT a medical diagnosis.
    4. Advise seeing a doctor.
    Keep it concise and empathetic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: cleanBase64(base64Image) } },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: "You are Derma AI, a helpful dermatology assistant. You MUST start every initial analysis with a strictly worded MEDICAL DISCLAIMER: 'Disclaimer: AI analysis is for informational purposes only and not a substitute for professional medical advice.'",
      }
    });
    
    return response.text || "I could not analyze the image. Please try again with a clearer photo.";
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error; // Re-throw to be caught by UI
  }
};

export const chatWithContext = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "Error: API Key not configured.";

  const ai = new GoogleGenAI({ apiKey });
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: history,
    config: {
      systemInstruction: "You are Derma AI. Answer follow-up questions about skin conditions. Always remind users to see a doctor if symptoms persist.",
    }
  });

  try {
    const result: GenerateContentResponse = await chat.sendMessage({ message: newMessage });
    return result.text || "I didn't understand that.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting right now. Please try again.";
  }
};

export const findLocalDoctors = async (
  lat: number,
  lng: number,
  query: string = "local clinics, general physicians and dermatologists"
): Promise<{ text: string; chunks: GroundingChunk[] }> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find ${query} near me. Return a list of highly rated places.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
    return {
      text: response.text || "Here are some local options:",
      chunks
    };
  } catch (error) {
    console.error("Doctor Search Error:", error);
    throw new Error("Failed to find local doctors. Please check API Key permissions.");
  }
};