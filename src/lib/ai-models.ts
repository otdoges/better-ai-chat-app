// AI Models from multiple providers (Groq, Google)

export interface AIModel {
  id: string;
  name: string;
  description: string;
  contextWindow: number;
  provider: "groq" | "google";
  developer: string;
  category: "production" | "preview" | "preview-system";
  capabilities: ("chat" | "reasoning" | "vision" | "audio" | "tts" | "guard" | "tools")[];
  isRecommended?: boolean;
  isDeprecated?: boolean;
  replacementModel?: string;
}

export const AI_MODELS: AIModel[] = [
  // Groq Models - Production
  {
    id: "llama-3.3-70b-versatile",
    name: "LLaMA 3.3 70B Versatile",
    description: "Most capable LLaMA model with excellent reasoning and performance",
    contextWindow: 128000,
    provider: "groq",
    developer: "Meta",
    category: "production",
    capabilities: ["chat", "reasoning", "tools"],
    isRecommended: true,
  },
  {
    id: "llama-3.1-8b-instant",
    name: "LLaMA 3.1 8B Instant",
    description: "Fast and efficient model for most tasks with instant responses",
    contextWindow: 128000,
    provider: "groq",
    developer: "Meta",
    category: "production",
    capabilities: ["chat", "tools"],
  },
  {
    id: "gemma2-9b-it",
    name: "Gemma 2 9B Instruct",
    description: "Google's efficient instruction-tuned model for various tasks",
    contextWindow: 8192,
    provider: "groq",
    developer: "Google",
    category: "production",
    capabilities: ["chat", "tools"],
  },

  // Google Gemini Models - Production
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    description: "Enhanced thinking and reasoning capabilities, multimodal understanding, advanced coding",
    contextWindow: 1048576,
    provider: "google",
    developer: "Google",
    category: "production",
    capabilities: ["chat", "reasoning", "vision", "audio", "tools"],
    isRecommended: true,
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description: "Adaptive thinking with cost efficiency, multimodal capabilities",
    contextWindow: 1048576,
    provider: "google",
    developer: "Google",
    category: "production",
    capabilities: ["chat", "reasoning", "vision", "audio", "tools"],
    isRecommended: true,
  },
  {
    id: "gemini-2.5-flash-lite-preview-06-17",
    name: "Gemini 2.5 Flash-Lite",
    description: "Most cost-efficient model supporting high throughput",
    contextWindow: 1048576,
    provider: "google",
    developer: "Google",
    category: "preview",
    capabilities: ["chat", "tools"],
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    description: "Next generation features with speed and realtime streaming capabilities",
    contextWindow: 1048576,
    provider: "google",
    developer: "Google",
    category: "production",
    capabilities: ["chat", "reasoning", "vision", "audio", "tools"],
  },
  {
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash-Lite",
    description: "Cost efficiency and low latency for high-volume applications",
    contextWindow: 1048576,
    provider: "google",
    developer: "Google",
    category: "production",
    capabilities: ["chat", "tools"],
  },
  {
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash (Experimental)",
    description: "Latest experimental Gemini model with enhanced capabilities",
    contextWindow: 1048576,
    provider: "google",
    developer: "Google",
    category: "preview",
    capabilities: ["chat", "reasoning", "vision", "tools"],
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    description: "Complex reasoning tasks across text, code, images, audio, and video",
    contextWindow: 2097152,
    provider: "google",
    developer: "Google",
    category: "production",
    capabilities: ["chat", "reasoning", "vision", "audio", "tools"],
    isDeprecated: true,
    replacementModel: "gemini-2.5-pro",
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    description: "Fast and versatile performance across modalities",
    contextWindow: 1048576,
    provider: "google",
    developer: "Google",
    category: "production",
    capabilities: ["chat", "reasoning", "vision", "audio", "tools"],
    isDeprecated: true,
    replacementModel: "gemini-2.5-flash",
  },
  {
    id: "gemini-1.5-flash-8b",
    name: "Gemini 1.5 Flash-8B",
    description: "High volume, lower intelligence tasks with efficient performance",
    contextWindow: 1048576,
    provider: "google",
    developer: "Google",
    category: "production",
    capabilities: ["chat", "tools"],
  },
  {
    id: "gemini-1.0-pro",
    name: "Gemini 1.0 Pro",
    description: "Stable production model for general-purpose text tasks",
    contextWindow: 32768,
    provider: "google",
    developer: "Google",
    category: "production",
    capabilities: ["chat", "tools"],
    isDeprecated: true,
    replacementModel: "gemini-1.5-flash-8b",
  },

  // Groq Preview Models
  {
    id: "deepseek-r1-distill-llama-70b",
    name: "DeepSeek R1 Distill LLaMA 70B",
    description: "Reasoning model distilled from DeepSeek R1 with strong mathematical and logical capabilities",
    contextWindow: 131072,
    provider: "groq",
    developer: "DeepSeek / Meta",
    category: "preview",
    capabilities: ["chat", "reasoning", "tools"],
  },
  {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    name: "LLaMA 4 Scout 17B",
    description: "Meta's next-generation multimodal model with vision capabilities",
    contextWindow: 128000,
    provider: "groq",
    developer: "Meta",
    category: "preview",
    capabilities: ["chat", "vision", "reasoning", "tools"],
  },
  {
    id: "qwen/qwen3-32b",
    name: "Qwen 3 32B",
    description: "Alibaba's latest large language model with strong multilingual capabilities",
    contextWindow: 32768,
    provider: "groq",
    developer: "Alibaba Cloud",
    category: "preview",
    capabilities: ["chat", "reasoning", "tools"],
  },
  {
    id: "mistral-saba-24b",
    name: "Mistral Saba 24B",
    description: "Mistral AI's efficient model with strong performance across various tasks",
    contextWindow: 32768,
    provider: "groq",
    developer: "Mistral AI",
    category: "preview",
    capabilities: ["chat", "tools"],
  },

  // Groq Experimental Systems
  {
    id: "compound-beta",
    name: "Compound Beta",
    description: "Groq's experimental compound system for enhanced performance",
    contextWindow: 128000,
    provider: "groq",
    developer: "Groq",
    category: "preview-system",
    capabilities: ["chat", "reasoning", "tools"],
  },
  {
    id: "compound-beta-mini",
    name: "Compound Beta Mini",
    description: "Lighter version of Groq's compound system for faster responses",
    contextWindow: 128000,
    provider: "groq",
    developer: "Groq",
    category: "preview-system",
    capabilities: ["chat", "tools"],
  },

  // Audio Models (Groq)
  {
    id: "whisper-large-v3",
    name: "Whisper Large v3",
    description: "OpenAI's state-of-the-art speech recognition model",
    contextWindow: 448000,
    provider: "groq",
    developer: "OpenAI",
    category: "production",
    capabilities: ["audio"],
  },
  {
    id: "whisper-large-v3-turbo",
    name: "Whisper Large v3 Turbo",
    description: "Faster speech recognition with excellent quality",
    contextWindow: 448000,
    provider: "groq",
    developer: "OpenAI",
    category: "production",
    capabilities: ["audio"],
  },

  // Guard Models (Groq)
  {
    id: "meta-llama/llama-guard-4-12b",
    name: "LLaMA Guard 4 12B",
    description: "Advanced content moderation model with multimodal capabilities",
    contextWindow: 8192,
    provider: "groq",
    developer: "Meta",
    category: "production",
    capabilities: ["guard"],
  },
];

export const getRecommendedModel = (): AIModel => {
  return AI_MODELS.find(model => model.isRecommended && !model.isDeprecated) || AI_MODELS[0];
};

export const getActiveModels = (): AIModel[] => {
  return AI_MODELS.filter(model => !model.isDeprecated);
};

export const getProductionModels = (): AIModel[] => {
  return AI_MODELS.filter(model => 
    model.category === "production" && !model.isDeprecated
  );
};

export const getPreviewModels = (): AIModel[] => {
  return AI_MODELS.filter(model => 
    model.category === "preview" && !model.isDeprecated
  );
};

export const getPreviewSystems = (): AIModel[] => {
  return AI_MODELS.filter(model => 
    model.category === "preview-system" && !model.isDeprecated
  );
};

export const getChatModels = (): AIModel[] => {
  return AI_MODELS.filter(model => 
    model.capabilities.includes("chat") && !model.isDeprecated
  );
};

// Get models suitable for text chat (excludes audio, TTS, and guard models)
export const getTextModels = (): AIModel[] => {
  return AI_MODELS.filter(model => 
    model.capabilities.includes("chat") && 
    !model.capabilities.includes("audio") && 
    !model.capabilities.includes("tts") && 
    !model.capabilities.includes("guard") &&
    !model.isDeprecated
  );
};

export const getReasoningModels = (): AIModel[] => {
  return AI_MODELS.filter(model => 
    model.capabilities.includes("reasoning") && !model.isDeprecated
  );
};

export const getVisionModels = (): AIModel[] => {
  return AI_MODELS.filter(model => 
    model.capabilities.includes("vision") && !model.isDeprecated
  );
};

export const getGroqModels = (): AIModel[] => {
  return AI_MODELS.filter(model => 
    model.provider === "groq" && !model.isDeprecated
  );
};

export const getGoogleModels = (): AIModel[] => {
  return AI_MODELS.filter(model => 
    model.provider === "google" && !model.isDeprecated
  );
};

export const getModelsByProvider = (provider: "groq" | "google"): AIModel[] => {
  return AI_MODELS.filter(model => 
    model.provider === provider && !model.isDeprecated
  );
};

export const getModelsByDeveloper = (developer: string): AIModel[] => {
  return AI_MODELS.filter(model => 
    model.developer === developer && !model.isDeprecated
  );
};

// Helper to get the correct provider client
export const getModelProvider = (modelId: string): "groq" | "google" | null => {
  const model = AI_MODELS.find(m => m.id === modelId);
  return model?.provider || null;
};

// For backwards compatibility
export type GroqModel = AIModel;
export const GROQ_MODELS = AI_MODELS; 