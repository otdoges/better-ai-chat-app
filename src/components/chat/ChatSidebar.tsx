import { useState } from "react";
import { Plus, MessageSquare, Settings, Menu, X, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  onDeleteConversation: (id: string) => void;
  onOpenSettings: () => void;
}

export function ChatSidebar({
  isOpen,
  onToggle,
  conversations,
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  onDeleteConversation,
  onOpenSettings,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    setConversationToDelete(conversationId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (conversationToDelete) {
      onDeleteConversation(conversationToDelete);
      setConversationToDelete(null);
    }
    setDeleteDialogOpen(false);
  };
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
          "fixed left-0 top-0 z-50 h-full w-64 transform bg-chat-sidebar border-r border-border transition-transform duration-300 ease-in-out lg:relative lg:z-0 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">{/* Keep existing code */}
          {/* Header */}
          <div className="p-4 border-b border-border">
            <Button
              onClick={onNewConversation}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant transition-all duration-200 hover:scale-[1.02]"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>

          {/* Search */}
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your threads..."
                className="pl-10 bg-chat-input border-border/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto px-2">
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="group relative"
                >
                  <Button
                    variant="ghost"
                    onClick={() => onConversationSelect(conversation.id)}
                    className={cn(
                      "w-full justify-start px-3 py-2.5 h-auto text-left transition-all duration-200 hover:bg-chat-message-hover",
                      activeConversationId === conversation.id
                        ? "bg-accent text-accent-foreground"
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
                  
                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteClick(e, conversation.id)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <Button
              variant="ghost"
              onClick={onOpenSettings}
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-chat-message-hover transition-colors"
            >
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Close button for mobile */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="absolute top-4 right-4 lg:hidden text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="fixed top-4 left-4 z-40 lg:hidden bg-chat-sidebar/90 backdrop-blur border border-border hover:bg-chat-message-hover transition-colors"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete the conversation and all its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border hover:bg-chat-message-hover">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}