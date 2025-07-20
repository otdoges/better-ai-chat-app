import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: string;
  };
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "group relative flex items-start space-x-4 p-4 hover:bg-chat-message-hover/50 transition-colors duration-200 animate-fade-in",
        !isUser && "bg-chat-message-ai/30"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg shadow-message",
          isUser
            ? "bg-gradient-primary text-primary-foreground"
            : "bg-card border border-border/50 text-muted-foreground"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-foreground">
            {isUser ? "You" : "AI Assistant"}
          </p>
          <span className="text-xs text-muted-foreground">
            {message.timestamp}
          </span>
        </div>
        
        <div className="prose prose-sm max-w-none text-foreground prose-pre:bg-muted prose-pre:border prose-pre:border-border/50 prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm">
          <p className="leading-relaxed whitespace-pre-wrap">
            {message.content}
            {isStreaming && (
              <span className="ml-1 inline-block h-3 w-2 bg-primary animate-pulse" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}