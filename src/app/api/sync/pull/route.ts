import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getChangesSince } from "@/lib/sync/sync-manager";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const lastSyncAt = body.lastSyncAt ? new Date(body.lastSyncAt) : null;

    const changes = await getChangesSince(userId, lastSyncAt);

    return NextResponse.json(changes);
  } catch (error) {
    console.error("Sync pull error:", error);
    return NextResponse.json(
      { error: "Pull failed" },
      { status: 500 }
    );
  }
}
