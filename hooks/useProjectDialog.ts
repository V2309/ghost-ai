"use client";

import { useState } from "react";

export type DialogType = "create" | "rename" | "delete" | null;

export interface ProjectDialogState {
  open: DialogType;
  projectId?: string;
  projectName?: string;
  formValue: string;
  loading: boolean;
}

export function useProjectDialog() {
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

  return {
    ...state,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    setFormValue,
    setLoading,
  };
}
