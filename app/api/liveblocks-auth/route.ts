import { liveblocks } from "@/lib/liveblocks-server";
import { checkProjectAccess } from "@/lib/project-access";
import { getUserColor } from "@/lib/colors";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { room } = await request.json();

    if (!room) {
      return new NextResponse("Room ID is required", { status: 400 });
    }

    // 1. Verify project access using the existing access helper
    const result = await checkProjectAccess(room);

    if (!result.access || !result.identity) {
      // Return 403 for unauthorized project access
      return new NextResponse(
        JSON.stringify({ reason: result.reason || "unauthorized" }), 
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const { identity } = result;

    // 2. Ensure the Liveblocks room exists (create only if needed)
    try {
      await liveblocks.getRoom(room);
    } catch (error: any) {
      // Room not found, create it
      if (error.status === 404) {
        await liveblocks.createRoom(room, {
          defaultAccesses: [], // Private by default
          metadata: {
            name: result.project?.name ?? "Unknown Project",
          }
        });
      } else {
        throw error;
      }
    }

    // 3. Return a session token with user name, avatar, and generated cursor color
    const session = liveblocks.prepareSession(identity.userId, {
      userInfo: {
        name: identity.name,
        avatar: identity.avatar,
        color: getUserColor(identity.userId),
      },
    });

    // Grant full access to the specific room
    session.allow(room, session.FULL_ACCESS);

    const { status, body } = await session.authorize();
    return new NextResponse(body, { status });
  } catch (error: any) {
    console.error("Liveblocks auth error:", error);
    if (error.status === 403) {
      console.error("Authentication failed. Check your LIVEBLOCKS_SECRET_KEY.");
    }
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Error", 
        message: error.message,
        details: error.details 
      }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
