"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useProjectActions } from "@/hooks/use-project-actions";

export function NewProjectButton() {
  const { openCreateDialog } = useProjectActions();

  return (
    <Button size="lg" className="gap-2" onClick={openCreateDialog}>
      <Plus className="w-5 h-5" />
      New Project
    </Button>
  );
}
