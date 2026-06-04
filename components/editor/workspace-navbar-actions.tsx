"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, MessageSquare } from "lucide-react";
import { ShareDialog } from "./share-dialog";

interface WorkspaceNavbarActionsProps {
  projectId: string;
  isOwner: boolean;
}

export function WorkspaceNavbarActions({ projectId, isOwner }: WorkspaceNavbarActionsProps) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="hidden sm:flex gap-2 border-border hover:bg-subtle"
        onClick={() => setShareOpen(true)}
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>
      
      <Button variant="ghost" size="icon" className="hover:bg-subtle">
        <MessageSquare className="w-5 h-5" />
      </Button>

      <ShareDialog 
        open={shareOpen} 
        onClose={() => setShareOpen(false)} 
        projectId={projectId}
        isOwner={isOwner}
      />
    </>
  );
}
