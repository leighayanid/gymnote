import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { processSyncOperations, type SyncOperation } from "@/lib/sync/sync-manager";

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
      { error: "Sync failed" },
      { status: 500 }
    );
  }
}
