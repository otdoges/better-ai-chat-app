import { MessageSquare, Menu, Moon, Sun, Download, Upload, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getTextModels, AIModel } from "@/lib/ai-models";
import { chatDB } from "@/lib/indexeddb";
import { useToast } from "@/hooks/use-toast";
import { ModelSelectionDialog } from "./ModelSelectionDialog";

interface ChatHeaderProps {
  title?: string;
  conversationCount?: number;
  onToggleSidebar?: () => void;
  selectedModel?: string;
  onModelChange?: (modelId: string) => void;
}

export function ChatHeader({ 
  title = "AI Chat Assistant", 
  conversationCount,
  onToggleSidebar,
  selectedModel,
  onModelChange
}: ChatHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [textModels] = useState(getTextModels());
  const [modelDialogOpen, setModelDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = theme === "dark";
  const currentModel = textModels.find(model => model.id === selectedModel);
  
  // Debug logging
  console.log('ChatHeader Debug:', {
    mounted,
    selectedModel,
    currentModel,
    onModelChange: !!onModelChange,
    textModelsLength: textModels.length
  });

  const handleExportData = async () => {
    try {
      const data = await chatDB.exportAllData();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `shimmer-chat-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: "Your chat history has been exported to a JSON file",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export failed",
        description: "Failed to export chat history",
        variant: "destructive",
      });
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        await chatDB.importData(data);
        
        toast({
          title: "Import successful",
          description: "Your chat history has been imported",
        });
        
        // Reload the page to reflect imported data
        window.location.reload();
      } catch (error) {
        console.error('Import failed:', error);
        toast({
          title: "Import failed",
          description: "Failed to import chat history. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    input.click();
  };

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
            {/* Model Selector */}
            {mounted && selectedModel && onModelChange && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModelDialogOpen(true)}
                className="h-9 px-3 border-border/50 bg-background/50 hover:bg-muted/50 text-foreground"
              >
                <Brain className="h-3 w-3 mr-2" />
                <span className="text-xs font-medium truncate max-w-32">
                  {currentModel?.name || selectedModel}
                </span>
              </Button>
            )}

            {/* Export/Import Menu */}
            {mounted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Data Management</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleExportData} className="cursor-pointer">
                    <Download className="h-4 w-4 mr-2" />
                    Export Chat History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleImportData} className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Chat History
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

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

      {/* Model Selection Dialog */}
      {mounted && selectedModel && onModelChange && (
        <ModelSelectionDialog
          isOpen={modelDialogOpen}
          onOpenChange={setModelDialogOpen}
          selectedModel={selectedModel}
          onModelSelect={onModelChange}
        />
      )}
    </div>
  );
}