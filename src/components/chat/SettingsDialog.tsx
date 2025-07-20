import { Settings, ChevronDown, Moon, Sun, Trash2, Download, Zap, Brain, Eye, Mic, Shield, Cpu, Star, FlaskConical, Beaker } from "lucide-react";
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
  SelectLabel,
  SelectSeparator,
  SelectGroup,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { 
  getTextModels, 
  getRecommendedModel, 
  getProductionModels,
  getPreviewModels,
  getPreviewSystems,
  type GroqModel 
} from "@/lib/groq-models";

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClearAllChats: () => void;
  selectedModel?: string;
  onModelChange?: (modelId: string) => void;
}

export function SettingsDialog({ 
  isOpen, 
  onOpenChange, 
  onClearAllChats,
  selectedModel,
  onModelChange
}: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const textModels = getTextModels();
  const productionModels = getProductionModels().filter(m => m.capabilities.includes("chat"));
  const previewModels = getPreviewModels().filter(m => m.capabilities.includes("chat"));
  const previewSystems = getPreviewSystems();
  const recommendedModel = getRecommendedModel();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDarkMode = theme === "dark";

  const getModelIcon = (model: GroqModel) => {
    if (model.capabilities.includes("vision")) return <Eye className="h-4 w-4" />;
    if (model.capabilities.includes("reasoning")) return <Brain className="h-4 w-4" />;
    if (model.capabilities.includes("tools")) return <Settings className="h-4 w-4" />;
    if (model.category === "preview-system") return <Beaker className="h-4 w-4" />;
    return <Cpu className="h-4 w-4" />;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "production": return <Star className="h-4 w-4 text-green-500" />;
      case "preview": return <FlaskConical className="h-4 w-4 text-yellow-500" />;
      case "preview-system": return <Beaker className="h-4 w-4 text-blue-500" />;
      default: return <Cpu className="h-4 w-4" />;
    }
  };

  const formatContextWindow = (tokens: number) => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`;
    return tokens.toString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border/50 max-h-[90vh] overflow-y-auto">
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
            <Select 
              value={selectedModel || recommendedModel.id} 
              onValueChange={onModelChange}
            >
              <SelectTrigger className="bg-background border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/50 max-h-80">
                {/* Production Models */}
                <SelectGroup>
                  <SelectLabel className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <Star className="h-4 w-4" />
                    <span>Production Models</span>
                  </SelectLabel>
                  {productionModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center space-x-2 w-full">
                        {getModelIcon(model)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{model.name}</span>
                            {model.isRecommended && (
                              <Zap className="h-3 w-3 text-primary flex-shrink-0" />
                            )}
                            <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded flex-shrink-0">
                              {formatContextWindow(model.contextWindow)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {model.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>

                <SelectSeparator />

                {/* Preview Models */}
                <SelectGroup>
                  <SelectLabel className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
                    <FlaskConical className="h-4 w-4" />
                    <span>Preview Models</span>
                  </SelectLabel>
                  {previewModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center space-x-2 w-full">
                        {getModelIcon(model)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{model.name}</span>
                            <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded flex-shrink-0">
                              {formatContextWindow(model.contextWindow)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {model.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>

                <SelectSeparator />

                {/* Preview Systems */}
                <SelectGroup>
                  <SelectLabel className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                    <Beaker className="h-4 w-4" />
                    <span>Experimental Systems</span>
                  </SelectLabel>
                  {previewSystems.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center space-x-2 w-full">
                        {getModelIcon(model)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{model.name}</span>
                            <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded flex-shrink-0">
                              {formatContextWindow(model.contextWindow)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {model.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {(() => {
              const currentModel = textModels.find(m => m.id === (selectedModel || recommendedModel.id)) || recommendedModel;
              return (
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(currentModel.category)}
                    <span>
                      {currentModel.category === "production" ? "Production" : 
                       currentModel.category === "preview" ? "Preview" : "Experimental"} • 
                      {currentModel.developer} • 
                      {currentModel.contextWindow.toLocaleString()} tokens
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentModel.capabilities.map(cap => (
                      <span key={cap} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          <Separator className="bg-border/50" />

          {/* Appearance */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-foreground">Appearance</Label>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm text-foreground flex items-center space-x-2">
                  {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  <span>Dark mode</span>
                </div>
                <div className="text-xs text-muted-foreground">Toggle dark/light theme</div>
              </div>
              <Switch 
                checked={isDarkMode} 
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
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
                className="w-full justify-start border-border/50 hover:bg-muted/50"
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