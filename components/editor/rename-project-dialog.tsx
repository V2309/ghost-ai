"use client";

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

interface RenameProjectDialogProps {
  open: boolean;
  projectName?: string;
  formValue: string;
  loading: boolean;
  onFormChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function RenameProjectDialog({
  open,
  projectName,
  formValue,
  loading,
  onFormChange,
  onClose,
  onSubmit,
}: RenameProjectDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && formValue.trim()) {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>
            Currently named &quot;{projectName}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="rename-input" className="text-sm font-medium">
              Project name
            </label>
            <Input
              ref={inputRef}
              id="rename-input"
              placeholder="e.g., My Design System"
              value={formValue}
              onChange={(e) => onFormChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!formValue.trim() || loading}>
            {loading ? "Renaming..." : "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
