"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useProjectDialog } from "@/hooks/useProjectDialog";
import { CreateProjectDialog } from "@/components/editor/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog";

export default function EditorPage() {
  const dialog = useProjectDialog();

  const handleCreateProject = () => {
    // Mock: just close the dialog after a brief delay
    dialog.setLoading(true);
    setTimeout(() => {
      dialog.setLoading(false);
      dialog.closeDialog();
    }, 500);
  };

  const handleRenameProject = () => {
    // Mock: just close the dialog after a brief delay
    dialog.setLoading(true);
    setTimeout(() => {
      dialog.setLoading(false);
      dialog.closeDialog();
    }, 500);
  };

  const handleDeleteProject = () => {
    // Mock: just close the dialog after a brief delay
    dialog.setLoading(true);
    setTimeout(() => {
      dialog.setLoading(false);
      dialog.closeDialog();
    }, 500);
  };

  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Create a project or open an existing one
          </h1>
          <p className="text-muted-foreground mb-6">
            Start a new architecture workspace, or choose a project from the sidebar.
          </p>
          <Button size="lg" className="gap-2" onClick={dialog.openCreateDialog}>
            <Plus className="w-5 h-5" />
            New Project
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <CreateProjectDialog
        open={dialog.open === "create"}
        formValue={dialog.formValue}
        loading={dialog.loading}
        onFormChange={dialog.setFormValue}
        onClose={dialog.closeDialog}
        onSubmit={handleCreateProject}
      />

      <RenameProjectDialog
        open={dialog.open === "rename"}
        projectName={dialog.projectName}
        formValue={dialog.formValue}
        loading={dialog.loading}
        onFormChange={dialog.setFormValue}
        onClose={dialog.closeDialog}
        onSubmit={handleRenameProject}
      />

      <DeleteProjectDialog
        open={dialog.open === "delete"}
        projectName={dialog.projectName}
        loading={dialog.loading}
        onClose={dialog.closeDialog}
        onSubmit={handleDeleteProject}
      />
    </>
  );
}
