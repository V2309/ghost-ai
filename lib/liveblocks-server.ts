import { Liveblocks } from "@liveblocks/node";

const secret = process.env.LIVEBLOCKS_SECRET_KEY;

if (!secret) {
  console.warn("⚠️ LIVEBLOCKS_SECRET_KEY is missing from environment variables!");
}

/**
 * Cached Liveblocks node client
 */
export const liveblocks = new Liveblocks({
  secret: secret || "sk_placeholder", // Fallback for build phase
});
