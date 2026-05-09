import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkProjectAccess } from "@/lib/project-access";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ projectId: string; collaboratorId: string }> }
) {
  try {
    const { projectId, collaboratorId } = await params;
    const { access, project, identity } = await checkProjectAccess(projectId);

    if (!access || !project || !identity) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Only owner can remove collaborators
    if (project.ownerId !== identity.userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const collaborator = await prisma.projectCollaborator.delete({
      where: {
        id: collaboratorId,
        projectId, // Extra safety
      },
    });

    return NextResponse.json(collaborator);
  } catch (error) {
    console.error("[COLLABORATOR_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
