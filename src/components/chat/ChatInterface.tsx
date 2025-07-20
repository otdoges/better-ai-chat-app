import { useState, useRef, useEffect } from "react";
import { ChatSidebar } from "./ChatSidebar";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SettingsDialog } from "./SettingsDialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { groq, streamText } from "@/lib/ai-client";
import { getRecommendedModel } from "@/lib/groq-models";

interface ModelStats {
  tokensPerSecond: number;
  timeToFirstToken: number;
  totalTime: number;
  totalTokens: number;
  model: string;
}

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  stats?: ModelStats;
}

interface Conversation {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
}

export function ChatInterface() {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(getRecommendedModel().id);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Getting Started",
      timestamp: "2 minutes ago",
      messages: [
        {
          id: "1",
          content: "Hello! I'm your AI assistant powered by Groq. How can I help you today?",
          role: "assistant",
          timestamp: "2 minutes ago",
        },
      ],
    },
  ]);
  const [activeConversationId, setActiveConversationId] = useState<string>("1");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string, conversationHistory: Message[]): Promise<void> => {
    const aiMessageId = (Date.now() + 1).toString();
    setStreamingMessageId(aiMessageId);

    // Timing tracking
    const startTime = performance.now();
    let firstTokenTime: number | null = null;
    let tokenCount = 0;

    // Create empty AI message to start streaming into
    const aiMessage: Message = {
      id: aiMessageId,
      content: "",
      role: "assistant",
      timestamp: "now",
    };

    // Add empty AI message to conversation
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversationId
          ? { ...conv, messages: [...conv.messages, aiMessage] }
          : conv
      )
    );

    try {
      // Prepare messages for the API
      const apiMessages = conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add the new user message
      apiMessages.push({
        role: "user" as const,
        content: userMessage,
      });

      // Check if API key is configured
      if (!import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_GROQ_API_KEY === 'your_groq_api_key_here') {
        throw new Error('Groq API key not configured. Please set VITE_GROQ_API_KEY in your .env file.');
      }

      // Stream the response
      const { textStream } = await streamText({
        model: groq(selectedModel),
        messages: apiMessages,
        temperature: 0.7,
        maxTokens: 2000,
      });

      let fullContent = "";

      for await (const delta of textStream) {
        // Track first token timing
        if (firstTokenTime === null) {
          firstTokenTime = performance.now();
        }

        // Rough token counting (approximation - each word or punctuation mark as a token)
        const deltaTokens = delta.split(/\s+/).filter(t => t.length > 0).length;
        tokenCount += deltaTokens;

        fullContent += delta;
        
        // Update the streaming message content
        setConversations(prev =>
          prev.map(conv =>
            conv.id === activeConversationId
              ? {
                  ...conv,
                  messages: conv.messages.map(msg =>
                    msg.id === aiMessageId
                      ? { ...msg, content: fullContent }
                      : msg
                  ),
                }
              : conv
          )
        );
      }

      // Calculate final stats
      const endTime = performance.now();
      const totalTime = (endTime - startTime) / 1000; // Convert to seconds
      const timeToFirstToken = firstTokenTime ? (firstTokenTime - startTime) / 1000 : 0;
      const tokensPerSecond = tokenCount > 0 ? tokenCount / totalTime : 0;

      const stats: ModelStats = {
        tokensPerSecond: Math.round(tokensPerSecond * 100) / 100,
        timeToFirstToken: Math.round(timeToFirstToken * 1000) / 1000,
        totalTime: Math.round(totalTime * 1000) / 1000,
        totalTokens: tokenCount,
        model: selectedModel,
      };

      // Update message with final stats
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversationId
            ? {
                ...conv,
                messages: conv.messages.map(msg =>
                  msg.id === aiMessageId
                    ? { ...msg, stats }
                    : msg
                ),
              }
            : conv
        )
      );

    } catch (error) {
      console.error("Error generating response:", error);
      
      // Update message with error
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversationId
            ? {
                ...conv,
                messages: conv.messages.map(msg =>
                  msg.id === aiMessageId
                    ? { 
                        ...msg, 
                        content: error instanceof Error 
                          ? `Error: ${error.message}` 
                          : "Sorry, I encountered an error while processing your request. Please try again."
                      }
                    : msg
                ),
              }
            : conv
        )
      );

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate response",
        variant: "destructive",
      });
    } finally {
      setStreamingMessageId(null);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: "now",
    };

    // Add user message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversationId
          ? { ...conv, messages: [...conv.messages, newUserMessage] }
          : conv
      )
    );

    setIsLoading(true);

    try {
      // Get conversation history for context
      const currentMessages = activeConversation?.messages || [];
      await generateResponse(content, currentMessages);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    toast({
      title: "Model changed",
      description: `Switched to ${modelId}`,
    });
  };

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `New Chat ${conversations.length + 1}`,
      timestamp: "now",
      messages: [
        {
          id: Date.now().toString(),
          content: "Hello! I'm your AI assistant powered by Groq. How can I help you today?",
          role: "assistant",
          timestamp: "now",
        },
      ],
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setSidebarOpen(false);
  };

  const handleConversationSelect = (id: string) => {
    setActiveConversationId(id);
    setSidebarOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    // If we deleted the active conversation, switch to another one or create new
    if (activeConversationId === id) {
      const remainingConversations = conversations.filter(conv => conv.id !== id);
      if (remainingConversations.length > 0) {
        setActiveConversationId(remainingConversations[0].id);
      } else {
        handleNewConversation();
      }
    }

    toast({
      title: "Conversation deleted",
      description: "The conversation has been permanently deleted.",
    });
  };

  const handleClearAllChats = () => {
    setConversations([]);
    handleNewConversation();
    setSettingsOpen(false);
    
    toast({
      title: "All conversations cleared",
      description: "All chat history has been permanently deleted.",
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onConversationSelect={handleConversationSelect}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <SettingsDialog
        isOpen={settingsOpen}
        onOpenChange={setSettingsOpen}
        onClearAllChats={handleClearAllChats}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <ChatHeader
          title={activeConversation?.title || "AI Chat Assistant"}
          conversationCount={conversations.length}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center border border-border/50 backdrop-blur-sm">
                    <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-foreground">Ready to Chat!</h3>
                    <p className="text-muted-foreground max-w-md leading-relaxed">
                      Start a conversation by typing your message below. I'm here to help with any questions or tasks you might have.
                    </p>
                  </div>
                  <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Currently using: {selectedModel}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isStreaming={streamingMessageId === message.id}
                  />
                ))}
                {isLoading && (
                  <div className="flex items-start space-x-4 p-6 animate-fade-in">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted border border-border/50">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">AI is thinking...</div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onStopGeneration={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}