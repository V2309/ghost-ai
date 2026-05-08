"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
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
          
          <TabsContent value="my-projects" className="flex-1 overflow-y-auto outline-none">
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
              <p className="text-sm">No projects yet.</p>
              <p className="text-xs mt-1">Create a new project to get started.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="shared" className="flex-1 overflow-y-auto outline-none">
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
              <p className="text-sm">No shared projects.</p>
              <p className="text-xs mt-1">Projects shared with you will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <Button className="w-full gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>
    </div>
  );
}
