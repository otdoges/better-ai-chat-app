import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Initialize clients
export const groq = createGroq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
});

export const google = createGoogleGenerativeAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
});

// Initialize clients with custom keys
export const createGroqWithKey = (apiKey: string) => createGroq({ apiKey });
export const createGoogleWithKey = (apiKey: string) => createGoogleGenerativeAI({ apiKey });

export { generateText, streamText } from 'ai'; 