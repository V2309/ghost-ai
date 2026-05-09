import { NewProjectButton } from "@/components/editor/new-project-button";
import { EditorLayout } from "@/components/editor/editor-layout";
import { getProjectsForUser } from "@/lib/projects";
import { ProjectActionsProvider } from "@/hooks/use-project-actions";
import { auth, clerkClient } from "@clerk/nextjs/server";

export default async function EditorPage() {
  const { userId } = await auth();
  
  let ownedProjects: any[] = [];
  let sharedProjects: any[] = [];

  if (userId) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;

    if (email) {
      const projects = await getProjectsForUser(userId, email);
      ownedProjects = projects.owned;
      sharedProjects = projects.shared;
    }
  }

  return (
    <ProjectActionsProvider>
      <EditorLayout ownedProjects={ownedProjects} sharedProjects={sharedProjects}>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 h-full min-h-[calc(100vh-3.5rem)]">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Create a project or open an existing one
            </h1>
            <p className="text-muted-foreground mb-6">
              Start a new architecture workspace, or choose a project from the sidebar.
            </p>
            <NewProjectButton />
          </div>
        </div>
      </EditorLayout>
    </ProjectActionsProvider>
  );
}
