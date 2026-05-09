import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { checkProjectAccess } from "@/lib/project-access";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const { access, project } = await checkProjectAccess(projectId);

    if (!access || !project) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const dbCollaborators = await prisma.projectCollaborator.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    });

    const client = await clerkClient();
    
    // Fetch owner info
    const ownerUser = await client.users.getUser(project.ownerId);
    const owner = {
      id: "owner",
      email: ownerUser.emailAddresses[0]?.emailAddress,
      name: `${ownerUser.firstName || ""} ${ownerUser.lastName || ""}`.trim(),
      imageUrl: ownerUser.imageUrl,
      role: "OWNER",
      createdAt: project.createdAt,
    };

    const collaborators = await Promise.all(
      dbCollaborators.map(async (c) => {
        const users = await client.users.getUserList({
          emailAddress: [c.email],
          limit: 1,
        });
        const user = users.data[0];

        return {
          id: c.id,
          email: c.email,
          name: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : null,
          imageUrl: user?.imageUrl || null,
          role: "COLLABORATOR",
          createdAt: c.createdAt,
        };
      })
    );

    return NextResponse.json([owner, ...collaborators]);
  } catch (error) {
    console.error("[COLLABORATORS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const { access, project, identity } = await checkProjectAccess(projectId);

    if (!access || !project || !identity) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Only owner can invite
    if (project.ownerId !== identity.userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return new NextResponse("Invalid email", { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if trying to invite self
    if (normalizedEmail === identity.email) {
      return new NextResponse("Cannot invite yourself", { status: 400 });
    }

    const collaborator = await prisma.projectCollaborator.create({
      data: {
        projectId,
        email: normalizedEmail,
      },
    });

    return NextResponse.json(collaborator);
  } catch (error: any) {
    if (error.code === "P2002") {
      return new NextResponse("Collaborator already exists", { status: 400 });
    }
    console.error("[COLLABORATORS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
