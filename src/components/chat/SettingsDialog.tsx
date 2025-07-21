import { Settings, Trash2, Moon, Sun, Key, Eye, EyeOff, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { chatDB } from "@/lib/indexeddb";
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClearAllChats: () => void;
}

export function SettingsDialog({ 
  isOpen, 
  onOpenChange, 
  onClearAllChats
}: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [groqApiKey, setGroqApiKey] = useState("");
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [showGoogleKey, setShowGoogleKey] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");

  useEffect(() => {
    setMounted(true);
    
    // Load saved API keys and system prompt
    const loadSettings = async () => {
      try {
        const savedGroqKey = await chatDB.getSetting('groqApiKey');
        const savedGoogleKey = await chatDB.getSetting('googleApiKey');
        const savedSystemPrompt = await chatDB.getSetting('systemPrompt');
        
        if (savedGroqKey) setGroqApiKey(savedGroqKey);
        if (savedGoogleKey) setGoogleApiKey(savedGoogleKey);
        if (savedSystemPrompt) setSystemPrompt(savedSystemPrompt);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const saveApiKey = async (type: 'groq' | 'google', key: string) => {
    try {
      const settingKey = type === 'groq' ? 'groqApiKey' : 'googleApiKey';
      await chatDB.saveSetting(settingKey, key);
      
      toast({
        title: "API key saved",
        description: `${type === 'groq' ? 'Groq' : 'Google'} API key has been saved successfully.`,
      });
    } catch (error) {
      console.error('Failed to save API key:', error);
      toast({
        title: "Error",
        description: "Failed to save API key.",
        variant: "destructive",
      });
    }
  };

  const saveSystemPrompt = async () => {
    try {
      await chatDB.saveSetting('systemPrompt', systemPrompt);
      
      toast({
        title: "System prompt saved",
        description: "Custom system prompt has been saved successfully.",
      });
    } catch (error) {
      console.error('Failed to save system prompt:', error);
      toast({
        title: "Error",
        description: "Failed to save system prompt.",
        variant: "destructive",
      });
    }
  };

  if (!mounted) {
    return null;
  }

  const isDarkMode = theme === "dark";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-foreground">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Customize your chat experience and manage your data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Theme</Label>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
              <div className="flex items-center space-x-3">
                {isDarkMode ? (
                  <Moon className="h-4 w-4 text-foreground" />
                ) : (
                  <Sun className="h-4 w-4 text-foreground" />
                )}
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </div>

          <Separator />

          {/* Custom System Prompt */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground flex items-center">
              <MessageSquareText className="h-4 w-4 mr-2" />
              Custom System Prompt
            </Label>
            <div className="space-y-2">
              <Textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Enter a custom system prompt to define the AI's behavior and personality..."
                className="min-h-[100px] text-sm"
                rows={4}
              />
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  This prompt will be sent with every message to define the AI's behavior.
                </div>
                <Button
                  size="sm"
                  onClick={saveSystemPrompt}
                  className="text-xs"
                >
                  Save Prompt
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* API Keys */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">API Keys</Label>
            
            {/* Groq API Key */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center">
                <Key className="h-3 w-3 mr-1" />
                Groq API Key (Optional - overrides .env)
              </Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    type={showGroqKey ? "text" : "password"}
                    value={groqApiKey}
                    onChange={(e) => setGroqApiKey(e.target.value)}
                    placeholder="Enter your Groq API key..."
                    className="text-xs pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowGroqKey(!showGroqKey)}
                    className="absolute right-0 top-0 h-full px-3"
                  >
                    {showGroqKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
                <Button
                  size="sm"
                  onClick={() => saveApiKey('groq', groqApiKey)}
                  disabled={!groqApiKey.trim()}
                  className="text-xs"
                >
                  Save
                </Button>
              </div>
            </div>

            {/* Google API Key */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center">
                <Key className="h-3 w-3 mr-1" />
                Google AI API Key (Required for Gemini models)
              </Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    type={showGoogleKey ? "text" : "password"}
                    value={googleApiKey}
                    onChange={(e) => setGoogleApiKey(e.target.value)}
                    placeholder="Enter your Google AI API key..."
                    className="text-xs pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowGoogleKey(!showGoogleKey)}
                    className="absolute right-0 top-0 h-full px-3"
                  >
                    {showGoogleKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
                <Button
                  size="sm"
                  onClick={() => saveApiKey('google', googleApiKey)}
                  disabled={!googleApiKey.trim()}
                  className="text-xs"
                >
                  Save
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg border border-border/30">
              <p>
                🔑 <strong>API Keys:</strong> Get your Groq API key from{' '}
                <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  console.groq.com
                </a>{' '}
                and Google AI API key from{' '}
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  aistudio.google.com
                </a>
              </p>
            </div>
          </div>

          <Separator />

          {/* Data Management */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Data Management</Label>
            <div className="space-y-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full justify-start bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Conversations
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your
                      conversations and chat history.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive hover:bg-destructive/90"
                      onClick={() => {
                        onClearAllChats();
                        onOpenChange(false);
                      }}
                    >
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg border border-border/30">
                <p>
                  💡 <strong>Tip:</strong> Your chat history is automatically saved in your browser's local storage.
                  Use the export/import feature in the header to backup your conversations.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* App Information */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">About</Label>
            <div className="text-xs text-muted-foreground space-y-2">
              <p>
                <strong>Shimmer Chat</strong> - Powered by Groq's lightning-fast AI models
              </p>
              <p>
                Model selection and export/import features are available in the header.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}