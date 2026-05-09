"use client";

import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  projectName?: string;
  rightActions?: React.ReactNode;
}

export function EditorNavbar({ isSidebarOpen, onToggleSidebar, projectName, rightActions }: EditorNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 bg-background border-b border-border z-40">
      <div className="flex items-center gap-2 w-1/3">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          {isSidebarOpen ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeftOpen className="w-5 h-5" />
          )}
        </Button>
      </div>
      <div className="flex items-center justify-center w-1/3">
        {projectName && (
          <span className="font-semibold truncate text-sm">{projectName}</span>
        )}
      </div>
      <div className="flex items-center justify-end w-1/3 gap-2">
        {rightActions}
        <UserButton />
      </div>
    </header>
  );
}
