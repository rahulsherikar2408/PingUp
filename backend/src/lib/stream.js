import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

let streamClient = null;

export function getStreamClient() {
  if (!streamClient && process.env.STREAM_API_KEY && process.env.STREAM_API_SECRET) {
    streamClient = new StreamClient(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);
  }
  return streamClient;
}

export function hasStreamConfig() {
  return Boolean(process.env.STREAM_API_KEY && process.env.STREAM_API_SECRET);
}

export async function generateStreamToken(user) {
  const client = getStreamClient();
  if (!client) {
    throw new Error("Stream credentials are not configured");
  }

  const userId = String(user._id);

  // Sync user profile to Stream
  try {
    await client.upsertUsers([
      {
        id: userId,
        name: user.fullName || "User",
        image: user.profilePic || undefined,
        role: "user",
      },
    ]);
  } catch (err) {
    console.error("Error upserting user to Stream:", err.message);
  }

  // Token valid for 24 hours
  const token = client.generateUserToken({
    user_id: userId,
    validity_in_seconds: 60 * 60 * 24,
  });

  return {
    token,
    apiKey: process.env.STREAM_API_KEY,
  };
}
