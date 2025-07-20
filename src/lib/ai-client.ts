import { createGroq } from '@ai-sdk/groq';

// Initialize Groq client
export const groq = createGroq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
});

export { generateText, streamText } from 'ai'; 