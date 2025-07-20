import { useState, useRef } from "react";
import { Send, Square, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage: (message: string, images?: string[]) => void;
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
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || images.length > 0) && !disabled && !isLoading) {
      onSendMessage(message.trim(), images.length > 0 ? images : undefined);
      setMessage("");
      setImages([]);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxImages = 4;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can upload up to ${maxImages} images at once.`,
        variant: "destructive",
      });
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > maxSize) {
        toast({
          title: "Image too large",
          description: `${file.name} is larger than 5MB. Please choose a smaller image.`,
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file.`,
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setImages(prev => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto max-w-4xl p-6">
        {/* Image Previews */}
        {images.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg border border-border/50"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative flex items-end space-x-4">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={images.length > 0 ? "Add a caption for your images..." : "Type your message here..."}
              disabled={disabled}
              className={cn(
                "min-h-[60px] max-h-32 resize-none bg-background border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 rounded-xl shadow-sm",
                "pr-4 text-sm leading-6"
              )}
            />
          </div>

          {/* Image Upload Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isLoading}
            className="h-12 w-12 p-0 rounded-xl border-border/50 hover:bg-muted/50"
          >
            <ImagePlus className="h-4 w-4" />
          </Button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          
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
                disabled={(!message.trim() && images.length === 0) || disabled}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 w-12 p-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-primary/20"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
        
        <div className="mt-3 text-xs text-muted-foreground/70 text-center">
          Press <kbd className="px-1.5 py-0.5 text-xs bg-muted/50 border border-border/50 rounded">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 text-xs bg-muted/50 border border-border/50 rounded">Shift + Enter</kbd> for new line
          {images.length > 0 && (
            <>
              <span className="mx-2">•</span>
              <span className="text-primary">📷 {images.length} image{images.length > 1 ? 's' : ''} attached</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}