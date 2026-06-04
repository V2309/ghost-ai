"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";

export type DialogType = "create" | "rename" | "delete" | null;

export interface ProjectDialogState {
  open: DialogType;
  projectId?: string;
  projectName?: string;
  formValue: string;
  loading: boolean;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

interface ProjectActionsContextValue extends ProjectDialogState {
  openCreateDialog: () => void;
  openRenameDialog: (projectId: string, currentName: string) => void;
  openDeleteDialog: (projectId: string, projectName: string) => void;
  closeDialog: () => void;
  setFormValue: (value: string) => void;
  setLoading: (loading: boolean) => void;
  submitCreateProject: () => Promise<void>;
  submitRenameProject: () => Promise<void>;
  submitDeleteProject: () => Promise<void>;
}

const ProjectActionsContext = createContext<ProjectActionsContextValue | null>(null);

export function ProjectActionsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<ProjectDialogState>({
    open: null,
    projectId: undefined,
    projectName: undefined,
    formValue: "",
    loading: false,
  });

  const openCreateDialog = () => {
    setState({
      open: "create",
      projectId: undefined,
      projectName: undefined,
      formValue: "",
      loading: false,
    });
  };

  const openRenameDialog = (projectId: string, currentName: string) => {
    setState({
      open: "rename",
      projectId,
      projectName: currentName,
      formValue: currentName,
      loading: false,
    });
  };

  const openDeleteDialog = (projectId: string, projectName: string) => {
    setState({
      open: "delete",
      projectId,
      projectName,
      formValue: "",
      loading: false,
    });
  };

  const closeDialog = () => {
    setState({
      open: null,
      projectId: undefined,
      projectName: undefined,
      formValue: "",
      loading: false,
    });
  };

  const setFormValue = (value: string) => {
    setState((prev) => ({
      ...prev,
      formValue: value,
    }));
  };

  const setLoading = (loading: boolean) => {
    setState((prev) => ({
      ...prev,
      loading,
    }));
  };

  const submitCreateProject = async () => {
    setLoading(true);
    try {
      const slug = generateSlug(state.formValue || "Untitled");
      const suffix = Math.random().toString(36).substring(2, 6);
      const id = `${slug}-${suffix}`;

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: state.formValue || "Untitled Project", id }),
      });

      if (!res.ok) throw new Error("Failed to create project");

      closeDialog();
      router.push(`/editor/${id}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const submitRenameProject = async () => {
    if (!state.projectId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${state.projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: state.formValue }),
      });

      if (!res.ok) throw new Error("Failed to rename project");

      closeDialog();
      router.refresh();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const submitDeleteProject = async () => {
    if (!state.projectId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${state.projectId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete project");

      closeDialog();
      
      if (window.location.pathname.includes(state.projectId)) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const value = {
    ...state,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    setFormValue,
    setLoading,
    submitCreateProject,
    submitRenameProject,
    submitDeleteProject,
  };

  return (
    <ProjectActionsContext.Provider value={value}>
      {children}
    </ProjectActionsContext.Provider>
  );
}

export function useProjectActions() {
  const context = useContext(ProjectActionsContext);
  if (!context) {
    throw new Error("useProjectActions must be used within a ProjectActionsProvider");
  }
  return context;
}
