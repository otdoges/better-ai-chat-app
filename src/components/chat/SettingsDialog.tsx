import { Settings, ChevronDown, Moon, Sun, Trash2, Download, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClearAllChats: () => void;
}

export function SettingsDialog({ isOpen, onOpenChange, onClearAllChats }: SettingsDialogProps) {
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
          {/* Model Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">AI Model</Label>
            <Select defaultValue="gpt-4">
              <SelectTrigger className="bg-chat-input border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                <SelectItem value="gpt-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>GPT-4 (Recommended)</span>
                  </div>
                </SelectItem>
                <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="claude">Claude 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-border/50" />

          {/* Appearance */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-foreground">Appearance</Label>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm text-foreground">Dark mode</div>
                <div className="text-xs text-muted-foreground">Toggle dark/light theme</div>
              </div>
              <Switch defaultChecked={false} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm text-foreground">Compact mode</div>
                <div className="text-xs text-muted-foreground">Reduce spacing between messages</div>
              </div>
              <Switch defaultChecked={false} />
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Privacy & Data */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-foreground">Privacy & Data</Label>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm text-foreground">Save conversations</div>
                <div className="text-xs text-muted-foreground">Store chat history locally</div>
              </div>
              <Switch defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm text-foreground">Analytics</div>
                <div className="text-xs text-muted-foreground">Help improve the app</div>
              </div>
              <Switch defaultChecked={true} />
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Data Management */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-foreground">Data Management</Label>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-border/50 hover:bg-chat-message-hover"
              >
                <Download className="mr-2 h-4 w-4" />
                Export conversations
              </Button>
              <Button
                variant="outline"
                onClick={onClearAllChats}
                className="w-full justify-start border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear all conversations
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}