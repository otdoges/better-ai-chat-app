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
    <div className="border-t border-border/50 bg-chat-input/50 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl p-4">
        <form onSubmit={handleSubmit} className="relative flex items-end space-x-3">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              disabled={disabled}
              className={cn(
                "min-h-[60px] max-h-32 resize-none bg-card border-border/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200",
                "pr-12" // Space for the button
              )}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            {isLoading ? (
              <Button
                type="button"
                size="sm"
                onClick={handleStop}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-10 w-10 p-0 rounded-full shadow-elegant transition-all duration-200 hover:scale-105"
              >
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="sm"
                disabled={!message.trim() || disabled}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground h-10 w-10 p-0 rounded-full shadow-elegant transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
        
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Press Enter to send, Shift + Enter for new line
        </div>
      </div>
    </div>
  );
}