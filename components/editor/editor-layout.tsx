"use client";

import { useState } from "react";
import { EditorNavbar } from "./editor-navbar";
import { ProjectSidebar } from "./project-sidebar";
import { useProjectDialog } from "@/hooks/useProjectDialog";

export function EditorLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dialog = useProjectDialog();

  return (
    <div className="flex min-h-screen flex-col">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex flex-1 pt-14">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onCreateProject={dialog.openCreateDialog}
          onRenameProject={dialog.openRenameDialog}
          onDeleteProject={dialog.openDeleteDialog}
        />
        
        <main className="flex-1 relative z-0 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
