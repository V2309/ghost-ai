"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: () => void;
  onRenameProject: (id: string, name: string) => void;
  onDeleteProject: (id: string, name: string) => void;
  ownedProjects: any[];
  sharedProjects: any[];
  currentRoomId?: string;
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
  ownedProjects,
  sharedProjects,
  currentRoomId,
}: ProjectSidebarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const ProjectItem = ({
    id,
    name,
    isOwner,
  }: {
    id: string;
    name: string;
    isOwner: boolean;
  }) => (
    <div className={cn(
      "flex items-center justify-between group px-2 py-2 rounded-md hover:bg-muted transition-colors",
      currentRoomId === id && "bg-muted font-medium"
    )}>
      <Link 
        href={`/editor/${id}`} 
        className="flex-1 text-sm text-foreground truncate min-w-0 pr-2" 
        onClick={onClose}
      >
        {name}
      </Link>
      {isOwner && (
        <DropdownMenu open={activeMenu === id} onOpenChange={(open) => setActiveMenu(open ? id : null)}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                onRenameProject(id, name);
                setActiveMenu(null);
              }}
            >
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                onDeleteProject(id, name);
                setActiveMenu(null);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          "fixed top-14 left-0 bottom-0 w-80 bg-background border-r border-border z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col p-4">
          <Tabs defaultValue="my-projects" className="flex-1 flex flex-col h-full">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="my-projects">My Projects</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
            </TabsList>

            <TabsContent
              value="my-projects"
              className="flex-1 overflow-y-auto outline-none"
            >
              {ownedProjects.length > 0 ? (
                <div className="space-y-1">
                  {ownedProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      id={project.id}
                      name={project.name}
                      isOwner={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                  <p className="text-sm">No projects yet.</p>
                  <p className="text-xs mt-1">Create a new project to get started.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="shared"
              className="flex-1 overflow-y-auto outline-none"
            >
              {sharedProjects.length > 0 ? (
                <div className="space-y-1">
                  {sharedProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      id={project.id}
                      name={project.name}
                      isOwner={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                  <p className="text-sm">No shared projects.</p>
                  <p className="text-xs mt-1">Projects shared with you will appear here.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-4 border-t border-border mt-auto">
          <Button className="w-full gap-2" onClick={onCreateProject}>
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>
      </div>
    </>
  );
}
