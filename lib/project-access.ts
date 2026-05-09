import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentIdentity() {
  const { userId } = await auth();
  if (!userId) return null;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;

  if (!email) return null;

  return {
    userId,
    email: email.trim().toLowerCase(),
    name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || email,
    avatar: user.imageUrl,
  };
}

export async function checkProjectAccess(roomId: string) {
  const identity = await getCurrentIdentity();
  if (!identity) return { access: false, reason: "unauthenticated" };

  const project = await prisma.project.findUnique({
    where: { id: roomId },
  });

  if (!project) return { access: false, reason: "not_found" };

  if (project.ownerId === identity.userId) {
    return { access: true, project, identity };
  }

  const collaborator = await prisma.projectCollaborator.findUnique({
    where: {
      projectId_email: {
        projectId: roomId,
        email: identity.email,
      },
    },
  });

  if (collaborator) {
    return { access: true, project, identity };
  }

  return { access: false, reason: "unauthorized" };
}
