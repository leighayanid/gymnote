import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { processSyncOperations, type SyncOperation } from "@/lib/sync/sync-manager";
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

    // Ensure user exists in database before syncing
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
    const operations = body.operations as SyncOperation[];

    if (!operations || !Array.isArray(operations)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const result = await processSyncOperations(operations, userId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Sync push error:", error);
    return NextResponse.json(
      { error: "Sync failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
