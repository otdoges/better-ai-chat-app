import { Settings, Trash2, Moon, Sun } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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