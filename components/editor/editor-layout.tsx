"use client";

import { useState } from "react";
import { EditorNavbar } from "./editor-navbar";
import { ProjectSidebar } from "./project-sidebar";
import { useProjectActions } from "@/hooks/use-project-actions";
import { CreateProjectDialog } from "./create-project-dialog";
import { RenameProjectDialog } from "./rename-project-dialog";
import { DeleteProjectDialog } from "./delete-project-dialog";

interface EditorLayoutProps {
  children: React.ReactNode;
  ownedProjects: any[];
  sharedProjects: any[];
  currentRoomId?: string;
  projectName?: string;
  rightActions?: React.ReactNode;
}

export function EditorLayout({ 
  children, 
  ownedProjects, 
  sharedProjects,
  currentRoomId,
  projectName,
  rightActions,
}: EditorLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const actions = useProjectActions();

  return (
    <div className="flex min-h-screen flex-col">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        projectName={projectName}
        rightActions={rightActions}
      />
      
      <div className="flex flex-1 pt-14">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onCreateProject={actions.openCreateDialog}
          onRenameProject={actions.openRenameDialog}
          onDeleteProject={actions.openDeleteDialog}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          currentRoomId={currentRoomId}
        />
        
        <main className="flex-1 relative z-0 flex flex-col">
          {children}
        </main>
      </div>

      <CreateProjectDialog
        open={actions.open === "create"}
        formValue={actions.formValue}
        loading={actions.loading}
        onFormChange={actions.setFormValue}
        onClose={actions.closeDialog}
        onSubmit={actions.submitCreateProject}
      />

      <RenameProjectDialog
        open={actions.open === "rename"}
        projectName={actions.projectName}
        formValue={actions.formValue}
        loading={actions.loading}
        onFormChange={actions.setFormValue}
        onClose={actions.closeDialog}
        onSubmit={actions.submitRenameProject}
      />

      <DeleteProjectDialog
        open={actions.open === "delete"}
        projectName={actions.projectName}
        loading={actions.loading}
        onClose={actions.closeDialog}
        onSubmit={actions.submitDeleteProject}
      />
    </div>
  );
}
