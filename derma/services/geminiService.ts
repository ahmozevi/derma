import { GoogleGenAI, Chat } from "@google/genai";
import { GeoLocation } from '../types';

// NOTE: In a real production app, image processing logic usually sits on the backend.
// For this POC, we interact directly with Gemini from the client.

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `
You are Derma, an AI assistant for preliminary skin condition analysis.

CRITICAL PROTOCOL:
1. You are NOT a doctor. You CANNOT provide a medical diagnosis.
2. If the user uploads an image, you MUST start your response with this exact bold text:
   "**MEDICAL DISCLAIMER: This is an AI-generated preliminary analysis and NOT a medical diagnosis. The information provided is for educational purposes only. Please consult a qualified dermatologist for an accurate diagnosis and treatment plan.**"
3. After the disclaimer, analyze the visual features of the skin condition in the image (color, texture, border, size).
4. Suggest 2-3 possible conditions that share these features, using hedging language like "consistent with," "resembles," or "may indicate."
5. Advise the user on general next steps (e.g., "monitor for changes," "seek immediate care if painful").
6. If the user asks to find a doctor, use the 'googleMaps' tool to find dermatologists or clinics near their location.
7. If the user mentions an emergency (trouble breathing, severe swelling), tell them to call emergency services immediately.
`;

export const initializeGemini = () => {
  if (ai) return; // Already initialized
  
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing from environment");
    return;
  }
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const startAnalysisChat = async (imageBase64: string, mimeType: string): Promise<string> => {
  initializeGemini();
  if (!ai) throw new Error("AI not initialized. Missing API Key?");

  try {
    // We use the 2.5 Flash model for a good balance of speed and vision capabilities
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleMaps: {} }], // Enable maps for follow-up questions
      },
    });

    // Initial message sends the image to context
    const result = await chatSession.sendMessage({
      message: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        {
          text: "Please analyze this skin image according to your protocol."
        }
      ]
    });

    return result.text || "I could not generate an analysis. Please try again.";
  } catch (error) {
    console.error("Error starting analysis:", error);
    throw error;
  }
};

export const sendMessageToChat = async (
  message: string,
  userLocation?: GeoLocation
): Promise<{ text: string; groundingUrls?: { uri: string; title: string }[] }> => {
  initializeGemini();
  if (!ai) throw new Error("AI not initialized");

  // Auto-initialize session if it doesn't exist (e.g., user accessed Find Help directly)
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleMaps: {} }],
      },
    });
  }

  try {
    // If we have location, we can provide it in the toolConfig for better map results
    let config = {};
    if (userLocation) {
        config = {
            toolConfig: {
                retrievalConfig: {
                    latLng: {
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude
                    }
                }
            }
        }
    }

    // Using the 'message' property as required by the SDK.
    const response = await chatSession.sendMessage({
        message: message,
        ...config 
    });

    // Extract grounding chunks if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingUrls: { uri: string; title: string }[] = [];

    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          groundingUrls.push({ uri: chunk.web.uri, title: chunk.web.title });
        }
        if (chunk.maps) {
             // Maps chunks often have uri and title
             groundingUrls.push({ uri: chunk.maps.uri, title: chunk.maps.title || "Map Location" });
        }
      });
    }

    return {
      text: response.text || "I'm having trouble understanding. Please ask again.",
      groundingUrls
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return { text: "An error occurred while communicating with the AI. Please check your connection." };
  }
};