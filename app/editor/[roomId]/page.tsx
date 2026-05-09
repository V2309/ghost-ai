import { redirect } from "next/navigation";
import { getProjectsForUser } from "@/lib/projects";
import { checkProjectAccess } from "@/lib/project-access";
import { AccessDenied } from "@/components/editor/access-denied";
import { EditorLayout } from "@/components/editor/editor-layout";
import { ProjectActionsProvider } from "@/hooks/use-project-actions";
import { WorkspaceNavbarActions } from "@/components/editor/workspace-navbar-actions";

export default async function WorkspacePage({ params }: { params: { roomId: string } }) {
  const { roomId } = await params;

  const access = await checkProjectAccess(roomId);

  if (!access.access) {
    if (access.reason === "unauthenticated") {
      redirect("/sign-in");
    }
    return <AccessDenied />;
  }

  const { project, identity } = access;

  // Fetch all projects for the sidebar
  const projects = await getProjectsForUser(identity!.userId, identity!.email);

  const isOwner = project?.ownerId === identity?.userId;

  const rightActions = (
    <WorkspaceNavbarActions 
      projectId={roomId} 
      isOwner={isOwner} 
    />
  );

  return (
    <ProjectActionsProvider>
      <EditorLayout 
        ownedProjects={projects.owned} 
        sharedProjects={projects.shared}
        currentRoomId={roomId}
        projectName={project?.name}
        rightActions={rightActions}
      >
        <div className="flex flex-1 w-full h-full min-h-[calc(100vh-3.5rem)]">
          {/* Main Canvas Area */}
          <div className="flex-1 flex items-center justify-center bg-zinc-950 text-muted-foreground relative">
            <div className="text-center">
              <p>Canvas Area for project: <span className="font-medium text-foreground">{project?.name}</span></p>
            </div>
          </div>
          
          {/* Right Sidebar Placeholder */}
          <div className="w-80 border-l border-border bg-background hidden lg:flex flex-col">
            <div className="p-4 border-b border-border h-14 flex items-center">
              <h3 className="font-medium">AI Assistant</h3>
            </div>
            <div className="flex-1 p-4 flex flex-col items-center justify-center text-muted-foreground">
              <p className="text-sm">AI Chat placeholder</p>
            </div>
          </div>
        </div>
      </EditorLayout>
    </ProjectActionsProvider>
  );
}
