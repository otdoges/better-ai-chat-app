import { generateText } from 'ai';
import { groq, createGroqWithKey } from './ai-client';
import { chatDB } from './indexeddb';

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  stats?: any;
  images?: string[];
}

export async function generateChatTitle(messages: Message[]): Promise<string> {
  try {
    // Use only the first few messages to generate title
    const relevantMessages = messages.slice(0, 6).filter(msg => msg.content.trim().length > 0);
    
    if (relevantMessages.length === 0) {
      return `New Chat ${new Date().toLocaleDateString()}`;
    }

    // Get custom Groq key if available
    const customGroqKey = await chatDB.getSetting('groqApiKey');
    const client = customGroqKey ? createGroqWithKey(customGroqKey) : groq;

    // Create a summary of the conversation
    const conversationSummary = relevantMessages
      .map(msg => `${msg.role}: ${msg.content.substring(0, 200)}`)
      .join('\n');

    const { text } = await generateText({
      model: client('gemma2-9b-it'),
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates short, descriptive titles for chat conversations. Generate a concise title (max 5 words) that captures the main topic or purpose of the conversation. Do not use quotes or special characters. Return only the title.'
        },
        {
          role: 'user',
          content: `Generate a short title for this conversation:\n\n${conversationSummary}`
        }
      ],
      maxTokens: 50,
      temperature: 0.3,
    });

    // Clean up the response and ensure it's reasonable
    const title = text.trim().replace(/[^\w\s-]/g, '').substring(0, 50);
    
    return title || `Chat ${new Date().toLocaleDateString()}`;
  } catch (error) {
    console.error('Failed to generate chat title:', error);
    return `Chat ${new Date().toLocaleDateString()}`;
  }
}

export function formatTimestamp(timestamp: string): string {
  try {
    if (timestamp === 'now') {
      return 'Just now';
    }
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return date.toLocaleDateString();
  } catch (error) {
    return timestamp;
  }
}

export function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.startsWith('data:image/');
} 