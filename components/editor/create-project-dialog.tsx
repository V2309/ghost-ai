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
import { generateSlug } from "@/hooks/use-project-actions";

interface CreateProjectDialogProps {
  open: boolean;
  formValue: string;
  loading: boolean;
  onFormChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function CreateProjectDialog({
  open,
  formValue,
  loading,
  onFormChange,
  onClose,
  onSubmit,
}: CreateProjectDialogProps) {
  const slug = generateSlug(formValue);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
          <DialogDescription>
            Give your project a name. It can be changed later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          <div className="space-y-2">
           <div className="">
             <label htmlFor="project-name" className="text-sm font-medium ">
              Project name
            </label>
           </div>
            <Input
              id="project-name"
              placeholder="e.g., My Design System"
              value={formValue}
              onChange={(e) => onFormChange(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>
            <div className="px-3 py-2 rounded-md bg-muted text-muted-foreground text-sm">
              {slug || "(enter a name)"}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!formValue.trim() || loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
