import { MessageSquare, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ChatHeaderProps {
  title?: string;
  conversationCount?: number;
  onToggleSidebar?: () => void;
}

export function ChatHeader({ 
  title = "AI Chat Assistant", 
  conversationCount,
  onToggleSidebar 
}: ChatHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = theme === "dark";

  return (
    <div className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-30">
      <div className="mx-auto max-w-4xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            {onToggleSidebar && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSidebar}
                className="lg:hidden h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 shadow-sm">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            
            <div>
              <h1 className="text-lg font-semibold text-foreground/90 leading-tight">{title}</h1>
              {conversationCount !== undefined && (
                <p className="text-sm text-muted-foreground/70 leading-tight">
                  {conversationCount} conversation{conversationCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Dark mode toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}
            
            {/* Online status */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}