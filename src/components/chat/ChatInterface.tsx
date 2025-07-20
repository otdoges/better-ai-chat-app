import { useState, useRef, useEffect } from "react";
import { ChatSidebar } from "./ChatSidebar";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SettingsDialog } from "./SettingsDialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
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
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Getting Started",
      timestamp: "2 minutes ago",
      messages: [
        {
          id: "1",
          content: "Hello! I'm your AI assistant. How can I help you today?",
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

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response with realistic delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
      "That's a great question! Let me think about that for a moment. Based on what you've mentioned, I believe the best approach would be to consider multiple perspectives and weigh the various factors involved.",
      "I understand what you're asking. This is definitely something worth exploring further. Would you like me to break this down into smaller, more manageable parts?",
      "Interesting point! This reminds me of similar situations where the key is to find the right balance. Let me share some thoughts that might be helpful.",
      "Thank you for sharing that with me. I can see why this would be important to you. Here's how I would approach this situation...",
      "That's a complex topic with many nuances. Let me provide you with a comprehensive overview that covers the main aspects you should consider.",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
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
      // Generate AI response
      const responseContent = await generateResponse(content);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: "assistant",
        timestamp: "now",
      };

      // Add AI message
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversationId
            ? { ...conv, messages: [...conv.messages, aiMessage] }
            : conv
        )
      );
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `New Chat ${conversations.length + 1}`,
      timestamp: "now",
      messages: [
        {
          id: Date.now().toString(),
          content: "Hello! I'm your AI assistant. How can I help you today?",
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
    <div className="flex h-screen bg-chat-bg">
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
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <ChatHeader
          title={activeConversation?.title || "AI Chat Assistant"}
          conversationCount={conversations.length}
        />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-elegant">
                    <svg className="w-8 h-8 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Ready to Chat!</h3>
                  <p className="text-muted-foreground max-w-md">
                    Start a conversation by typing your message below. I'm here to help with any questions or tasks you might have.
                  </p>
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
                  <div className="flex items-start space-x-4 p-4 bg-chat-message-ai/30 animate-fade-in">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card border border-border/50">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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