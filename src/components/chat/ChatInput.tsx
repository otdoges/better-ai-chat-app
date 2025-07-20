import { useState } from "react";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  onStopGeneration?: () => void;
  disabled?: boolean;
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
  onStopGeneration,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleStop = () => {
    onStopGeneration?.();
  };

  return (
    <div className="border-t border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto max-w-4xl p-6">
        <form onSubmit={handleSubmit} className="relative flex items-end space-x-4">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              disabled={disabled}
              className={cn(
                "min-h-[60px] max-h-32 resize-none bg-background border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 rounded-xl shadow-sm",
                "pr-4 text-sm leading-6"
              )}
            />
          </div>
          
          <div className="flex flex-col">
            {isLoading ? (
              <Button
                type="button"
                size="sm"
                onClick={handleStop}
                className="bg-destructive/90 hover:bg-destructive text-destructive-foreground h-12 w-12 p-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-destructive/20"
              >
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="sm"
                disabled={!message.trim() || disabled}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 w-12 p-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-primary/20"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
        
        <div className="mt-3 text-xs text-muted-foreground/70 text-center">
          Press <kbd className="px-1.5 py-0.5 text-xs bg-muted/50 border border-border/50 rounded">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 text-xs bg-muted/50 border border-border/50 rounded">Shift + Enter</kbd> for new line
        </div>
      </div>
    </div>
  );
}