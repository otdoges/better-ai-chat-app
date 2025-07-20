import { Bot, User, Copy, Clock, Zap, Timer, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ModelStats {
  tokensPerSecond: number;
  timeToFirstToken: number;
  totalTime: number;
  totalTokens: number;
  model: string;
}

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: string;
    stats?: ModelStats;
  };
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  const { toast } = useToast();
  const isUser = message.role === "user";

  const copyStats = () => {
    if (!message.stats) return;
    
    const statsText = `Model: ${message.stats.model}
Total Time: ${message.stats.totalTime}s
Time to First Token: ${message.stats.timeToFirstToken}s
Tokens per Second: ${message.stats.tokensPerSecond}
Total Tokens: ${message.stats.totalTokens}`;

    navigator.clipboard.writeText(statsText).then(() => {
      toast({
        title: "Stats copied",
        description: "Model statistics copied to clipboard",
      });
    });
  };

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

        {/* Model Statistics - only show for assistant messages with stats */}
        {!isUser && message.stats && !isStreaming && (
          <div className="mt-4 p-3 bg-muted/30 border border-border/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-muted-foreground flex items-center">
                <Cpu className="h-3 w-3 mr-1" />
                Model Statistics
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyStats}
                className="h-6 px-2 text-xs hover:bg-muted/50"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center space-x-1">
                <Timer className="h-3 w-3 text-blue-500" />
                <span className="text-muted-foreground">Total:</span>
                <span className="font-mono">{message.stats.totalTime}s</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-green-500" />
                <span className="text-muted-foreground">First token:</span>
                <span className="font-mono">{message.stats.timeToFirstToken}s</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-3 w-3 text-yellow-500" />
                <span className="text-muted-foreground">Speed:</span>
                <span className="font-mono">{message.stats.tokensPerSecond} t/s</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-muted-foreground">Model:</span>
                <span className="font-mono text-xs truncate">{message.stats.model}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}