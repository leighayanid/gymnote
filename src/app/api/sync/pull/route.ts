import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getChangesSince } from "@/lib/sync/sync-manager";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ensure user exists in database before pulling
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!existingUser) {
      // Create user from Clerk data
      const clerkUser = await currentUser();
      if (clerkUser) {
        await db.insert(users).values({
          id: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
        }).onConflictDoNothing();
      }
    }

    const body = await request.json();
    const lastSyncAt = body.lastSyncAt ? new Date(body.lastSyncAt) : null;

    const changes = await getChangesSince(userId, lastSyncAt);

    return NextResponse.json(changes);
  } catch (error) {
    console.error("Sync pull error:", error);
    return NextResponse.json(
      { error: "Pull failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
