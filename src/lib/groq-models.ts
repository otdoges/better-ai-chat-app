// Groq Models based on https://console.groq.com/docs/models

export interface GroqModel {
  id: string;
  name: string;
  description: string;
  contextWindow: number;
  developer: string;
  category: "production" | "preview" | "preview-system";
  capabilities: ("chat" | "reasoning" | "vision" | "audio" | "tts" | "guard" | "tools")[];
  isRecommended?: boolean;
  isDeprecated?: boolean;
  replacementModel?: string;
}

export const GROQ_MODELS: GroqModel[] = [
  // Production Models - Stable and recommended for production use
  {
    id: "llama-3.3-70b-versatile",
    name: "LLaMA 3.3 70B Versatile",
    description: "Most capable LLaMA model with excellent reasoning and performance",
    contextWindow: 128000,
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
    developer: "Meta",
    category: "production",
    capabilities: ["chat", "tools"],
  },
  {
    id: "gemma2-9b-it",
    name: "Gemma 2 9B Instruct",
    description: "Google's efficient instruction-tuned model for various tasks",
    contextWindow: 8192,
    developer: "Google",
    category: "production",
    capabilities: ["chat", "tools"],
  },
  {
    id: "whisper-large-v3",
    name: "Whisper Large v3",
    description: "OpenAI's state-of-the-art speech recognition model",
    contextWindow: 448000,
    developer: "OpenAI",
    category: "production",
    capabilities: ["audio"],
  },
  {
    id: "whisper-large-v3-turbo",
    name: "Whisper Large v3 Turbo",
    description: "Faster speech recognition with excellent quality",
    contextWindow: 448000,
    developer: "OpenAI",
    category: "production",
    capabilities: ["audio"],
  },
  {
    id: "distil-whisper-large-v3-en",
    name: "Distil Whisper Large v3 (English)",
    description: "Distilled version of Whisper optimized for English speech recognition",
    contextWindow: 448000,
    developer: "Hugging Face",
    category: "production",
    capabilities: ["audio"],
  },
  {
    id: "meta-llama/llama-guard-4-12b",
    name: "LLaMA Guard 4 12B",
    description: "Advanced content moderation model with multimodal capabilities",
    contextWindow: 8192,
    developer: "Meta",
    category: "production",
    capabilities: ["guard"],
  },

  // Preview Models - Early access models for evaluation
  {
    id: "deepseek-r1-distill-llama-70b",
    name: "DeepSeek R1 Distill LLaMA 70B",
    description: "Reasoning model distilled from DeepSeek R1 with strong mathematical and logical capabilities",
    contextWindow: 131072,
    developer: "DeepSeek / Meta",
    category: "preview",
    capabilities: ["chat", "reasoning", "tools"],
  },
  {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    name: "LLaMA 4 Scout 17B",
    description: "Meta's next-generation multimodal model with vision capabilities",
    contextWindow: 128000,
    developer: "Meta",
    category: "preview",
    capabilities: ["chat", "vision", "reasoning", "tools"],
  },
  {
    id: "meta-llama/llama-4-maverick-17b-128e-instruct",
    name: "LLaMA 4 Maverick 17B",
    description: "Advanced LLaMA 4 model optimized for complex reasoning tasks",
    contextWindow: 128000,
    developer: "Meta",
    category: "preview",
    capabilities: ["chat", "reasoning", "tools"],
  },
  {
    id: "qwen/qwen3-32b",
    name: "Qwen 3 32B",
    description: "Alibaba's latest large language model with strong multilingual capabilities",
    contextWindow: 32768,
    developer: "Alibaba Cloud",
    category: "preview",
    capabilities: ["chat", "reasoning", "tools"],
  },
  {
    id: "mistral-saba-24b",
    name: "Mistral Saba 24B",
    description: "Mistral AI's efficient model with strong performance across various tasks",
    contextWindow: 32768,
    developer: "Mistral AI",
    category: "preview",
    capabilities: ["chat", "tools"],
  },
  {
    id: "moonshotai/kimi-k2-instruct",
    name: "Kimi K2 Instruct",
    description: "Moonshot AI's 1T parameter MoE model designed for agentic intelligence",
    contextWindow: 200000,
    developer: "Moonshot AI",
    category: "preview",
    capabilities: ["chat", "tools"],
  },
  {
    id: "meta-llama/llama-prompt-guard-2-22m",
    name: "LLaMA Prompt Guard 2 22M",
    description: "Lightweight model for prompt injection detection and safety",
    contextWindow: 4096,
    developer: "Meta",
    category: "preview",
    capabilities: ["guard"],
  },
  {
    id: "meta-llama/llama-prompt-guard-2-86m",
    name: "LLaMA Prompt Guard 2 86M",
    description: "Enhanced prompt injection detection model with better accuracy",
    contextWindow: 4096,
    developer: "Meta",
    category: "preview",
    capabilities: ["guard"],
  },

  // Preview Systems - Groq's experimental compound models
  {
    id: "compound-beta",
    name: "Compound Beta",
    description: "Groq's experimental compound system for enhanced performance",
    contextWindow: 128000,
    developer: "Groq",
    category: "preview-system",
    capabilities: ["chat", "reasoning", "tools"],
  },
  {
    id: "compound-beta-mini",
    name: "Compound Beta Mini",
    description: "Lighter version of Groq's compound system for faster responses",
    contextWindow: 128000,
    developer: "Groq",
    category: "preview-system",
    capabilities: ["chat", "tools"],
  },

  // Deprecated Models (kept for reference but marked as deprecated)
  {
    id: "llama3-70b-8192",
    name: "LLaMA 3 70B (Deprecated)",
    description: "Legacy LLaMA 3 model - use llama-3.3-70b-versatile instead",
    contextWindow: 8192,
    developer: "Meta",
    category: "production",
    capabilities: ["chat"],
    isDeprecated: true,
    replacementModel: "llama-3.3-70b-versatile",
  },
  {
    id: "llama3-8b-8192",
    name: "LLaMA 3 8B (Deprecated)",
    description: "Legacy LLaMA 3 model - use llama-3.1-8b-instant instead",
    contextWindow: 8192,
    developer: "Meta",
    category: "production",
    capabilities: ["chat"],
    isDeprecated: true,
    replacementModel: "llama-3.1-8b-instant",
  },
  {
    id: "mixtral-8x7b-32768",
    name: "Mixtral 8x7B (Deprecated)",
    description: "Legacy Mixtral model - use mistral-saba-24b or llama-3.3-70b-versatile instead",
    contextWindow: 32768,
    developer: "Mistral AI",
    category: "production",
    capabilities: ["chat"],
    isDeprecated: true,
    replacementModel: "mistral-saba-24b",
  },
];

export const getRecommendedModel = (): GroqModel => {
  return GROQ_MODELS.find(model => model.isRecommended && !model.isDeprecated) || GROQ_MODELS[0];
};

export const getActiveModels = (): GroqModel[] => {
  return GROQ_MODELS.filter(model => !model.isDeprecated);
};

export const getProductionModels = (): GroqModel[] => {
  return GROQ_MODELS.filter(model => 
    model.category === "production" && !model.isDeprecated
  );
};

export const getPreviewModels = (): GroqModel[] => {
  return GROQ_MODELS.filter(model => 
    model.category === "preview" && !model.isDeprecated
  );
};

export const getPreviewSystems = (): GroqModel[] => {
  return GROQ_MODELS.filter(model => 
    model.category === "preview-system" && !model.isDeprecated
  );
};

export const getChatModels = (): GroqModel[] => {
  return GROQ_MODELS.filter(model => 
    model.capabilities.includes("chat") && !model.isDeprecated
  );
};

// Get models suitable for text chat (excludes audio, TTS, and guard models)
export const getTextModels = (): GroqModel[] => {
  return GROQ_MODELS.filter(model => 
    model.capabilities.includes("chat") && 
    !model.capabilities.includes("audio") && 
    !model.capabilities.includes("tts") && 
    !model.capabilities.includes("guard") &&
    !model.isDeprecated
  );
};

export const getReasoningModels = (): GroqModel[] => {
  return GROQ_MODELS.filter(model => 
    model.capabilities.includes("reasoning") && !model.isDeprecated
  );
};

export const getVisionModels = (): GroqModel[] => {
  return GROQ_MODELS.filter(model => 
    model.capabilities.includes("vision") && !model.isDeprecated
  );
};

export const getAudioModels = (): GroqModel[] => {
  return GROQ_MODELS.filter(model => 
    model.capabilities.includes("audio") && !model.isDeprecated
  );
};

export const getTTSModels = (): GroqModel[] => {
  return GROQ_MODELS.filter(model => 
    model.capabilities.includes("tts") && !model.isDeprecated
  );
};

export const getGuardModels = (): GroqModel[] => {
  return GROQ_MODELS.filter(model => 
    model.capabilities.includes("guard") && !model.isDeprecated
  );
};

export const getModelsByDeveloper = (developer: string): GroqModel[] => {
  return GROQ_MODELS.filter(model => 
    model.developer === developer && !model.isDeprecated
  );
}; 