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
        "group relative flex items-start space-x-4 p-6 transition-all duration-200 hover:bg-muted/30 animate-fade-in border-b border-border/20",
        isUser && "bg-muted/10"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border backdrop-blur-sm transition-all duration-200",
          isUser
            ? "bg-primary text-primary-foreground border-primary/20 shadow-lg shadow-primary/10"
            : "bg-background border-border/50 text-muted-foreground hover:bg-muted/50"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 space-y-3 overflow-hidden">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-foreground/90">
            {isUser ? "You" : "AI Assistant"}
          </p>
          <span className="text-xs text-muted-foreground/70">
            {message.timestamp}
          </span>
        </div>
        
        <div className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/50 prose-pre:rounded-lg prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-medium">
          <div className="text-foreground/90 leading-7 whitespace-pre-wrap text-sm">
            {message.content}
            {isStreaming && (
              <span className="ml-1 inline-block h-3 w-1 bg-primary animate-pulse rounded-sm" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}