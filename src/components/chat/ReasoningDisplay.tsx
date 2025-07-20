import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Brain, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReasoningDisplayProps {
  thinkingContent: string;
  className?: string;
  isStreaming?: boolean;
}

export function ReasoningDisplay({ thinkingContent, className, isStreaming = false }: ReasoningDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(isStreaming);

  // Auto-expand when streaming starts
  useEffect(() => {
    if (isStreaming) {
      setIsExpanded(true);
    }
  }, [isStreaming]);

  // Parse thinking content into sections if it contains structured thinking
  const parseThinkingContent = (content: string) => {
    // Split by common reasoning patterns
    const sections = content.split(/(?=(?:Let me think|I need to|First,|Next,|Then,|Finally,|Therefore,|So,|In summary,|To summarize))/i)
      .filter(section => section.trim().length > 0)
      .map(section => section.trim());

    if (sections.length <= 1) {
      return [{ title: "Reasoning", content: content.trim() }];
    }

    return sections.map((section, index) => {
      // Extract title from the beginning of each section
      const lines = section.split('\n');
      const firstLine = lines[0];
      
      // Check if first line looks like a title/header
      if (firstLine.length < 100 && (
        firstLine.includes('Let me think') ||
        firstLine.includes('I need to') ||
        firstLine.includes('First') ||
        firstLine.includes('Next') ||
        firstLine.includes('Then') ||
        firstLine.includes('Finally') ||
        firstLine.includes('Therefore') ||
        firstLine.includes('So,') ||
        firstLine.includes('In summary') ||
        firstLine.includes('To summarize')
      )) {
        return {
          title: firstLine,
          content: lines.slice(1).join('\n').trim()
        };
      }

      return {
        title: `Step ${index + 1}`,
        content: section
      };
    });
  };

  const sections = parseThinkingContent(thinkingContent);

  return (
    <div className={cn("mt-4 rounded-lg border border-amber-200/30 bg-amber-50/30 dark:border-amber-800/30 dark:bg-amber-950/20", className)}>
      {/* Header */}
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between p-4 h-auto hover:bg-amber-100/50 dark:hover:bg-amber-900/20 rounded-lg"
      >
        <div className="flex items-center space-x-2">
          <Brain className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Reasoning
          </span>
          {isStreaming ? (
            <div className="flex space-x-1">
              <div className="h-1 w-1 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-1 w-1 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="h-1 w-1 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <div className="h-1 w-1 rounded-full bg-amber-500 animate-pulse" />
          )}
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-xs text-amber-600/70 dark:text-amber-400/70">
            {sections.length} {sections.length === 1 ? 'step' : 'steps'}
          </span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          )}
        </div>
      </Button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 animate-fade-in">
          <div className="h-px bg-amber-200/50 dark:bg-amber-800/50" />
          
          {sections.map((section, index) => (
            <div key={index} className="space-y-2">
              {sections.length > 1 && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-800">
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                      {index + 1}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    {section.title}
                  </h4>
                </div>
              )}
              
              <div className="text-sm text-amber-700/90 dark:text-amber-300/90 leading-relaxed whitespace-pre-wrap pl-7">
                {section.content || section.title}
                {isStreaming && index === sections.length - 1 && (
                  <span className="ml-1 inline-block h-3 w-1 bg-amber-500 animate-pulse rounded-sm" />
                )}
              </div>
              
              {index < sections.length - 1 && sections.length > 1 && (
                <div className="h-px bg-amber-200/30 dark:bg-amber-800/30 ml-7" />
              )}
            </div>
          ))}

          {/* Footer indicator */}
          <div className="flex items-center justify-center pt-2">
            <div className="flex items-center space-x-1">
              <Lightbulb className="h-3 w-3 text-amber-500" />
              <span className="text-xs text-amber-600/60 dark:text-amber-400/60">
                AI reasoning process
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 