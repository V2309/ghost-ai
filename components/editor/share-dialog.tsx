"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Trash2, Link, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Collaborator {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  role: "OWNER" | "COLLABORATOR";
}

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  isOwner: boolean;
}

export function ShareDialog({ open, onClose, projectId, isOwner }: ShareDialogProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCollaborators();
    }
  }, [open, projectId]);

  const fetchCollaborators = async () => {
    setFetching(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      if (res.ok) {
        const data = await res.json();
        setCollaborators(data);
      }
    } catch (error) {
      console.error("Failed to fetch collaborators", error);
    } finally {
      setFetching(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setEmail("");
        fetchCollaborators();
      } else {
        const error = await res.text();
        alert(error);
      }
    } catch (error) {
      console.error("Failed to invite", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCollaborators();
      }
    } catch (error) {
      console.error("Failed to remove collaborator", error);
    }
  };

  const copyLink = () => {
    const url = `${window.location.origin}/editor/${projectId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-3xl bg-surface border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            Share Project
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Invite others to collaborate on this system design.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Copy Link Section */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/editor/${projectId}`}
                className="pr-10 bg-base border-border rounded-xl text-xs h-9 focus-visible:ring-accent-primary"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-9 gap-2 border-border hover:bg-subtle"
              onClick={copyLink}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-state-success" />
                  <span className="text-state-success">Copied!</span>
                </>
              ) : (
                <>
                  <Link className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </Button>
          </div>

          {/* Invite Form - Only for Owner */}
          {isOwner && (
            <form onSubmit={handleInvite} className="flex items-center gap-2">
              <Input
                placeholder="Collaborator email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-base border-border rounded-xl h-10 focus-visible:ring-accent-primary"
                disabled={loading}
              />
              <Button
                type="submit"
                className="bg-accent-primary hover:bg-accent-primary/90 text-black font-semibold rounded-xl h-10 px-4"
                disabled={loading || !email}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                <span className="ml-2">Invite</span>
              </Button>
            </form>
          )}

          {/* Collaborator List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-secondary text-white">
                People with access
              </h4>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {collaborators.length} total
              </span>
            </div>
            <ScrollArea className="h-[280px] -mr-4">
              <div className="space-y-2 pr-4 pb-2">
                {fetching && collaborators.length === 0 ? (
                  <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading...
                  </div>
                ) : (
                  collaborators.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-3 bg-base/50 border border-border rounded-2xl group hover:border-border-subtle transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border">
                          {c.imageUrl && <AvatarImage src={c.imageUrl} />}
                          <AvatarFallback className="bg-subtle text-xs uppercase">
                            {c.name ? c.name.substring(0, 2) : c.email.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold truncate max-w-[150px]">
                              {c.name || c.email}
                            </span>
                            <span className={cn(
                              "text-[8px] font-bold px-1.5 py-0.5 rounded-full tracking-wider border",
                              c.role === "OWNER"
                                ? "bg-accent-primary-dim text-accent-primary border-accent-primary/20"
                                : "bg-subtle text-muted-foreground border-border"
                            )}>
                              {c.role}
                            </span>
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {c.email}
                          </span>
                        </div>
                      </div>
                      {isOwner && c.role === "COLLABORATOR" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-xl text-state-error hover:bg-state-error/10 hover:text-state-error transition-opacity sm:opacity-0 group-hover:opacity-100"
                          onClick={() => handleRemove(c.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
