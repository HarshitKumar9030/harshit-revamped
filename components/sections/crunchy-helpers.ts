import { readFile } from "node:fs/promises";
import path from "node:path";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null;
}

function getAtPath(value: unknown, pathParts: string[]): unknown {
  let current: unknown = value;
  for (const part of pathParts) {
    if (!isRecord(current)) return undefined;
    current = current[part];
  }
  return current;
}

function readString(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
}

export function pickString(value: unknown, candidates: string[][]): string | undefined {
  for (const candidate of candidates) {
    const resolved = readString(getAtPath(value, candidate));
    if (resolved) return resolved;
  }
  return undefined;
}

export function getItemId(item: unknown): string | undefined {
  return pickString(item, [
    ["id"],
    ["panel", "id"],
    ["episode_metadata", "id"],
    ["panel", "episode_metadata", "id"],
    ["episode_metadata", "episode_id"],
    ["panel", "episode_metadata", "episode_id"],
  ]);
}

export function getSeasonId(value: unknown): string | undefined {
  return pickString(value, [
    ["season_id"],
    ["episode_metadata", "season_id"],
    ["panel", "season_id"],
    ["panel", "episode_metadata", "season_id"],
  ]);
}

export function getBestImageSource(images: unknown): string | undefined {
  const candidateBuckets = [
    getAtPath(images, ["thumbnail"]),
    getAtPath(images, ["poster_wide"]),
    getAtPath(images, ["poster_tall"]),
    getAtPath(images, ["banner_wide"]),
    getAtPath(images, ["banner_tall"]),
  ];

  for (const bucket of candidateBuckets) {
    if (!Array.isArray(bucket) || bucket.length === 0) continue;

    const firstBucket = bucket[0];
    if (!Array.isArray(firstBucket) || firstBucket.length === 0) continue;

    const target = firstBucket[firstBucket.length - 1];
    if (!isRecord(target)) continue;

    const source = readString(target.source);
    if (source) return source;
  }

  const queue: unknown[] = [images];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    if (isRecord(current)) {
      const source = readString(current.source);
      if (source) return source;

      for (const value of Object.values(current)) {
        queue.push(value);
      }
      continue;
    }

    if (Array.isArray(current)) {
      for (const value of current) {
        queue.push(value);
      }
    }
  }

  return undefined;
}

export async function readCookieFromJson(): Promise<string> {
  const cookiePath = path.join(process.cwd(), "cookie.json");

  try {
    const raw = await readFile(cookiePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    return (
      pickString(parsed, [["cookie"], ["crunchyrollCookie"]])
      ?? ""
    );
  } catch {
    return "";
  }
}
