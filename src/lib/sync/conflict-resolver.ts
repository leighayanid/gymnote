/**
 * Conflict Resolution Strategy: Last-Write-Wins with Version Tracking
 *
 * This module handles sync conflicts between local and server data.
 * The strategy is:
 * 1. Compare versions - higher version wins
 * 2. If versions are equal, compare timestamps - later timestamp wins
 * 3. Mark conflicts for manual resolution if needed
 */

export interface SyncEntity {
  id: string;
  version: number;
  localUpdatedAt: Date;
  serverUpdatedAt: Date;
  syncStatus: "pending" | "synced" | "conflict";
}

export interface ConflictResult {
  winner: "local" | "server";
  requiresManualResolution: boolean;
}

/**
 * Determine which version of an entity should win in a conflict
 */
export function resolveConflict(
  local: SyncEntity,
  server: SyncEntity
): ConflictResult {
  // Version comparison
  if (local.version > server.version) {
    return { winner: "local", requiresManualResolution: false };
  }
  if (server.version > local.version) {
    return { winner: "server", requiresManualResolution: false };
  }

  // Same version - use timestamp (last-write-wins)
  const localTime = new Date(local.localUpdatedAt).getTime();
  const serverTime = new Date(server.serverUpdatedAt).getTime();

  if (localTime > serverTime) {
    return { winner: "local", requiresManualResolution: false };
  }
  if (serverTime > localTime) {
    return { winner: "server", requiresManualResolution: false };
  }

  // Exact same time and version - unlikely but possible
  // Default to server to ensure consistency across devices
  return { winner: "server", requiresManualResolution: false };
}

/**
 * Merge two entities, taking non-null values from both
 * Useful for partial updates
 */
export function mergeEntities<T extends Record<string, unknown>>(
  local: T,
  server: T,
  conflictResult: ConflictResult
): T {
  const winner = conflictResult.winner === "local" ? local : server;
  const loser = conflictResult.winner === "local" ? server : local;

  // Start with winner's data
  const merged = { ...winner };

  // For each field in loser that is undefined in winner, use loser's value
  for (const key in loser) {
    if (merged[key] === undefined && loser[key] !== undefined) {
      (merged as Record<string, unknown>)[key] = loser[key];
    }
  }

  return merged;
}

/**
 * Check if an entity needs to be synced based on its status
 */
export function needsSync(entity: SyncEntity): boolean {
  return entity.syncStatus === "pending";
}

/**
 * Check if an entity has a conflict
 */
export function hasConflict(entity: SyncEntity): boolean {
  return entity.syncStatus === "conflict";
}

/**
 * Calculate if local changes should be pushed
 * Returns true if local is newer than server
 */
export function shouldPush(
  local: SyncEntity,
  serverUpdatedAt: Date | null
): boolean {
  if (!serverUpdatedAt) {
    // No server record exists - definitely push
    return true;
  }

  const localTime = new Date(local.localUpdatedAt).getTime();
  const serverTime = serverUpdatedAt.getTime();

  return localTime > serverTime;
}
