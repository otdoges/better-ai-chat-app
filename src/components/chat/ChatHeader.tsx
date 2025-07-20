import { MessageSquare } from "lucide-react";

interface ChatHeaderProps {
  title?: string;
  conversationCount?: number;
}

export function ChatHeader({ title = "AI Chat Assistant", conversationCount }: ChatHeaderProps) {
  return (
    <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="mx-auto max-w-4xl px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant">
              <MessageSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">{title}</h1>
              {conversationCount !== undefined && (
                <p className="text-sm text-muted-foreground">
                  {conversationCount} conversation{conversationCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse-glow"></div>
            <span className="text-sm text-muted-foreground">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}