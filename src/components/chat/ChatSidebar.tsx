import { useState } from "react";
import { Plus, MessageSquare, Settings, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  timestamp: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
}

export function ChatSidebar({
  isOpen,
  onToggle,
  conversations,
  activeConversationId,
  onConversationSelect,
  onNewConversation,
}: ChatSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 transform bg-gradient-sidebar border-r border-border/50 transition-transform duration-300 ease-in-out lg:relative lg:z-0 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/30">
            <h2 className="text-lg font-semibold text-foreground">Conversations</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <Button
              onClick={onNewConversation}
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground border-0 shadow-elegant transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto px-2">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <Button
                  key={conversation.id}
                  variant="ghost"
                  onClick={() => onConversationSelect(conversation.id)}
                  className={cn(
                    "w-full justify-start px-3 py-2.5 h-auto text-left transition-all duration-200 group hover:bg-chat-message-hover",
                    activeConversationId === conversation.id
                      ? "bg-chat-message-ai text-foreground border border-border/50"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <MessageSquare className="mr-3 h-4 w-4 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {conversation.title}
                    </div>
                    <div className="text-xs text-muted-foreground/70">
                      {conversation.timestamp}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border/30 p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-chat-message-hover transition-colors"
            >
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-chat-message-hover transition-colors"
            >
              <User className="mr-3 h-4 w-4" />
              Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="fixed top-4 left-4 z-40 lg:hidden bg-chat-sidebar/90 backdrop-blur border border-border/50 hover:bg-chat-message-hover transition-colors"
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  );
}