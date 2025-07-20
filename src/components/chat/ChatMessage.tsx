import { Bot, User, Copy, Clock, Zap, Timer, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ReasoningDisplay } from "./ReasoningDisplay";

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

// Function to parse and extract thinking content
const parseMessageContent = (content: string) => {
  // Extract thinking content from <think> tags
  const thinkRegex = /<think>([\s\S]*?)<\/think>/gi;
  let thinkingContent = '';
  let cleanedContent = content;

  let match;
  while ((match = thinkRegex.exec(content)) !== null) {
    thinkingContent += match[1].trim() + '\n\n';
    cleanedContent = cleanedContent.replace(match[0], '');
  }

  return {
    content: cleanedContent.trim(),
    thinking: thinkingContent.trim()
  };
};

// Function to parse and render message content with syntax highlighting
const renderMessageContent = (content: string, isStreaming: boolean, toast: any) => {
  // Regex to match code blocks with optional language specification
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
  const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];
  
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, match.index)
      });
    }

    // Add code block
    parts.push({
      type: 'code',
      content: match[2] || '',
      language: match[1] || 'text'
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last code block
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(lastIndex)
    });
  }

  // If no code blocks found, treat entire content as text
  if (parts.length === 0) {
    parts.push({
      type: 'text',
      content: content
    });
  }

  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: "Code copied",
        description: "Code block copied to clipboard",
      });
    });
  };

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <div key={index} className="relative group/code">
              <div className="absolute top-2 right-12 text-xs text-muted-foreground/60 bg-background/80 px-2 py-1 rounded">
                {part.language}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyCodeToClipboard(part.content)}
                className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-background/80"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <SyntaxHighlighter
                language={part.language}
                style={oneDark}
                customStyle={{
                  margin: 0,
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  border: '1px solid hsl(var(--border))',
                  paddingTop: '2.5rem', // Extra padding for the language label and copy button
                }}
                codeTagProps={{
                  style: {
                    fontSize: '0.875rem',
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  }
                }}
              >
                {part.content}
              </SyntaxHighlighter>
            </div>
          );
        } else {
          // Render inline code with backticks
          const inlineCodeRegex = /`([^`]+)`/g;
          const textParts = part.content.split(inlineCodeRegex);
          
          return (
            <div key={index} className="text-foreground/90 leading-7 whitespace-pre-wrap text-sm">
              {textParts.map((textPart, textIndex) => {
                if (textIndex % 2 === 1) {
                  // This is inline code
                  return (
                    <code
                      key={textIndex}
                      className="bg-muted/50 px-1.5 py-1 rounded text-sm font-medium"
                    >
                      {textPart}
                    </code>
                  );
                } else {
                  // This is regular text
                  return textPart;
                }
              })}
            </div>
          );
        }
      })}
      {isStreaming && (
        <span className="ml-1 inline-block h-3 w-1 bg-primary animate-pulse rounded-sm" />
      )}
    </div>
  );
};

export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  const { toast } = useToast();
  const isUser = message.role === "user";

  // Parse message content to extract thinking (including during streaming)
  const { content: cleanedContent, thinking } = parseMessageContent(message.content);

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
        
        {/* Reasoning Display - show during streaming and after completion for assistant messages */}
        {!isUser && thinking && (
          <ReasoningDisplay 
            thinkingContent={thinking} 
            isStreaming={isStreaming}
          />
        )}

        <div className="prose prose-sm max-w-none dark:prose-invert">
          {renderMessageContent(cleanedContent, isStreaming, toast)}
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