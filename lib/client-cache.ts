// Client dedup cache — same GET in one tab doesn't hit network repeatedly.
// Module-level Map, TTL 60s. Browser-only (not for 1k-concurrent server, tab-level).
const TTL_MS = 60_000;
const MAX_ENTRIES = 500; // Prevent unbounded growth

interface Entry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, Entry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

// Periodic cleanup of expired entries (browser only)
if (typeof window !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.expiresAt <= now) store.delete(key);
    }
    // Also clean up any stuck inflight promises
    for (const [key, promise] of inflight.entries()) {
      // Check if promise is settled (we can't directly check, so we rely on .finally)
      // This is a best-effort cleanup
    }
    // Enforce max entries by removing oldest
    if (store.size > MAX_ENTRIES) {
      const keysToDelete = Array.from(store.keys()).slice(0, store.size - MAX_ENTRIES);
      for (const key of keysToDelete) store.delete(key);
    }
  }, 30_000); // Clean every 30s
}

export async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const hit = store.get(key);
  if (hit !== undefined && hit.expiresAt > now) return hit.value as T;
  
  const ongoing = inflight.get(key);
  if (ongoing !== undefined) return ongoing as Promise<T>;
  
  const task: Promise<T> = fn()
    .then((value: T): T => {
      // Enforce max entries before adding new
      if (store.size >= MAX_ENTRIES) {
        const oldestKey = store.keys().next().value;
        if (oldestKey !== undefined) store.delete(oldestKey);
      }
      store.set(key, { value, expiresAt: Date.now() + TTL_MS });
      return value;
    })
    .finally((): void => {
      inflight.delete(key);
    })
    .catch((err) => {
      // Ensure inflight is cleaned up even on error
      inflight.delete(key);
      throw err;
    });
  
  inflight.set(key, task);
  return task;
}

export function clearClientCache(key?: string): void {
  if (key === undefined) {
    store.clear();
    return;
  }
  store.delete(key);
}