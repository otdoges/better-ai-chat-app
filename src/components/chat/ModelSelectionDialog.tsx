import { useState } from "react";
import { Search, Star, FlaskConical, Beaker, Brain, Eye, Settings as SettingsIcon, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTextModels, getProductionModels, getPreviewModels, getPreviewSystems, type GroqModel } from "@/lib/groq-models";
import { cn } from "@/lib/utils";

interface ModelSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
}

export function ModelSelectionDialog({
  isOpen,
  onOpenChange,
  selectedModel,
  onModelSelect
}: ModelSelectionDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const allTextModels = getTextModels();
  const productionModels = getProductionModels().filter(m => m.capabilities.includes("chat"));
  const previewModels = getPreviewModels().filter(m => m.capabilities.includes("chat"));
  const previewSystems = getPreviewSystems();

  const getModelIcon = (model: GroqModel) => {
    if (model.capabilities.includes("vision")) return <Eye className="h-4 w-4" />;
    if (model.capabilities.includes("reasoning")) return <Brain className="h-4 w-4" />;
    if (model.capabilities.includes("tools")) return <SettingsIcon className="h-4 w-4" />;
    if (model.category === "preview-system") return <Beaker className="h-4 w-4" />;
    return <Brain className="h-4 w-4" />;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "production": return <Star className="h-4 w-4 text-green-500" />;
      case "preview": return <FlaskConical className="h-4 w-4 text-yellow-500" />;
      case "preview-system": return <Beaker className="h-4 w-4 text-blue-500" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const formatContextWindow = (tokens: number) => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`;
    return tokens.toString();
  };

  const getModelsForCategory = (category: string) => {
    switch (category) {
      case "production": return productionModels;
      case "preview": return previewModels;
      case "experimental": return previewSystems;
      default: return allTextModels;
    }
  };

  const filteredModels = getModelsForCategory(selectedCategory).filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.developer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleModelSelect = (model: GroqModel) => {
    onModelSelect(model.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[80vh] max-h-[90vh] p-0 bg-background border-border/50 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2 text-foreground">
              <Brain className="h-5 w-5 text-primary" />
              <span>Select AI Model</span>
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search models by name, description, or developer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border/50 focus:border-primary/50"
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="h-full flex flex-col">
            {/* Category Tabs */}
            <div className="px-6 pt-4 pb-2">
              <TabsList className="grid w-full grid-cols-4 bg-muted/30">
                <TabsTrigger value="all" className="flex items-center space-x-2 text-xs">
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">All Models</span>
                  <span className="sm:hidden">All</span>
                </TabsTrigger>
                <TabsTrigger value="production" className="flex items-center space-x-2 text-xs">
                  <Star className="h-4 w-4" />
                  <span className="hidden sm:inline">Production</span>
                  <span className="sm:hidden">Prod</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center space-x-2 text-xs">
                  <FlaskConical className="h-4 w-4" />
                  <span className="hidden sm:inline">Preview</span>
                  <span className="sm:hidden">Prev</span>
                </TabsTrigger>
                <TabsTrigger value="experimental" className="flex items-center space-x-2 text-xs">
                  <Beaker className="h-4 w-4" />
                  <span className="hidden sm:inline">Experimental</span>
                  <span className="sm:hidden">Exp</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Models List */}
            <div className="flex-1 min-h-0 px-6 pb-6">
              <TabsContent value={selectedCategory} className="h-full mt-0 data-[state=active]:flex data-[state=active]:flex-col">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-3 pb-4">
                    {filteredModels.map((model) => (
                      <div
                        key={model.id}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md",
                          selectedModel === model.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border/50 hover:border-border bg-card hover:bg-accent/50"
                        )}
                        onClick={() => handleModelSelect(model)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            {/* Model Header */}
                            <div className="flex items-center space-x-2">
                              {getModelIcon(model)}
                              <h3 className="font-semibold text-foreground">{model.name}</h3>
                              {model.isRecommended && (
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                  <Zap className="h-3 w-3 mr-1" />
                                  Recommended
                                </Badge>
                              )}
                              {selectedModel === model.id && (
                                <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                                  Selected
                                </Badge>
                              )}
                            </div>

                            {/* Model Description */}
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {model.description}
                            </p>

                            {/* Model Details */}
                            <div className="flex items-center flex-wrap gap-3 text-xs">
                              <div className="flex items-center space-x-1">
                                {getCategoryIcon(model.category)}
                                <span className="text-muted-foreground">
                                  {model.category === "production" ? "Production" : 
                                   model.category === "preview" ? "Preview" : "Experimental"}
                                </span>
                              </div>
                              
                              <div className="text-muted-foreground">
                                by {model.developer}
                              </div>
                              
                              <Badge variant="outline" className="text-xs">
                                {formatContextWindow(model.contextWindow)} tokens
                              </Badge>
                            </div>

                            {/* Capabilities */}
                            <div className="flex items-center space-x-1">
                              {model.capabilities.map((capability) => (
                                <Badge
                                  key={capability}
                                  variant="secondary"
                                  className="text-xs bg-muted/50 text-muted-foreground"
                                >
                                  {capability}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Selection Indicator */}
                          <div className="ml-4">
                            {selectedModel === model.id && (
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredModels.length === 0 && (
                      <div className="text-center py-12">
                        <Brain className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No models found</h3>
                        <p className="text-muted-foreground">
                          Try adjusting your search query or selecting a different category.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/50 bg-muted/20">
          <p className="text-xs text-muted-foreground text-center">
            💡 Production models are stable and recommended. Preview models offer latest features but may be less stable.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 