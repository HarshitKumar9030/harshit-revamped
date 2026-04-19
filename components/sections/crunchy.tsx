import { readFile } from "node:fs/promises";
import path from "node:path";
import { CrunchyrollClient, type WatchHistoryEntry } from "crunchy-api";
import { ArrowUpRight } from "lucide-react";
import { AnimeHoverList } from "@/components/ui/anime-hover-list";
import { getBestImageSource } from "@/components/sections/crunchy-helpers";

type JsonObject = Record<string, unknown>;

type CrunchyDisplayItem = {
  key: string;
  title: string;
  detail: string;
  slug: string;
  image?: string;
};

function isRecord(value: unknown): value is JsonObject {
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
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function readNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function pickString(value: unknown, candidates: string[][]): string | undefined {
  for (const candidate of candidates) {
    const resolved = readString(getAtPath(value, candidate));
    if (resolved) return resolved;
  }
  return undefined;
}

function pickNumber(value: unknown, candidates: string[][]): number | undefined {
  for (const candidate of candidates) {
    const resolved = readNumber(getAtPath(value, candidate));
    if (resolved !== undefined) return resolved;
  }
  return undefined;
}

function normalizeEntry(entry: WatchHistoryEntry, index: number): CrunchyDisplayItem {
  const title =
    pickString(entry, [
      ["series_title"],
      ["seriesTitle"],
      ["panel", "episode_metadata", "series_title"],
      ["panel", "series_metadata", "series_title"],
      ["panel", "series_title"],
      ["panel", "title"],
      ["title"],
      ["episode_title"],
      ["panel", "episode_title"],
      ["slug_title"],
    ]) ?? "Untitled " + (index + 1);

  const episodeNumber = pickNumber(entry, [
    ["episode_number"],
    ["panel", "episode_number"],
    ["episode_metadata", "episode_number"],
    ["panel", "episode_metadata", "episode_number"],
  ]);

  const episodeTitle = pickString(entry, [
    ["episode_title"],
    ["title"],
    ["panel", "episode_title"],
    ["panel", "title"],
    ["panel", "episode_metadata", "title"],
  ]);

  const detailParts: string[] = [];

  if (episodeNumber !== undefined) {
    detailParts.push("EP " + episodeNumber);
  }

  if (episodeTitle && episodeTitle !== title) {
    detailParts.push(episodeTitle);
  }

  const detail = detailParts.length > 0 ? detailParts.join(" - " ) : "In progress";

  const key =
    pickString(entry, [["id"], ["panel", "id"], ["slug"], ["panel", "slug"]]) ??
    "entry-" + index;

  const slug = pickString(entry, [["slug_title"], ["panel", "slug_title"]]) ?? "unknown";

  const image = getBestImageSource(
    getAtPath(entry, ["panel", "images"]) ||
    getAtPath(entry, ["images"]) ||
    getAtPath(entry, ["panel", "episode_metadata", "images"]) ||
    getAtPath(entry, ["episode_metadata", "images"]) ||
    getAtPath(entry, ["panel", "series_metadata", "images"]),
  );

  return {
    key,
    title,
    detail,
    slug,
    image
  };
}

async function readCookieFromJson(): Promise<string> {
  const cookiePath = path.join(process.cwd(), "cookie.json");
  try {
    const raw = await readFile(cookiePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) return "";
    const cookie = readString(parsed.cookie) ?? readString(parsed.crunchyrollCookie);
    return cookie ?? "";
  } catch {
    return "";
  }
}

async function getCrunchyData() {
  const cookieFromJson = await readCookieFromJson();
  const cookie = cookieFromJson || process.env.CRUNCHYROLL_COOKIE || "";
  if (!cookie) return { watching: [], history: [], cookieConfigured: false };
  try {
    const client = new CrunchyrollClient();
    await client.authenticateWithRtCookie({ cookie });
    const watchHistory = await client
      .getWatchHistory({ page_size: 30, page: 1 })
      .catch(() => ({ data: [] as WatchHistoryEntry[] }));
    const currentlyWatching = await client
      .getCurrentlyWatching({ page_size: 30, page: 1 })
      .catch(() => ({ data: [] as WatchHistoryEntry[] }));
    return {
      watching: currentlyWatching.data.map(normalizeEntry).slice(0, 5),
      history: watchHistory.data.map(normalizeEntry).slice(0, 5),
      cookieConfigured: true,
    };
  } catch {
    return { watching: [], history: [], cookieConfigured: true };
  }
}

export async function CrunchyStatus() {
  const { watching, history, cookieConfigured } = await getCrunchyData();

  if (!cookieConfigured) {
    return (
      <section className="w-full bg-[#111] py-24 md:py-32 px-6 md:px-24 text-[#F0EDE5] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#D9ED92]/5 opacity-50 pointer-events-none"></div>
        <div className="flex flex-col gap-4 opacity-60 relative z-10">
          <span className="uppercase text-sm font-bold tracking-[0.2em] font-mono text-[#D9ED92]">Anime / Setup</span>
          <p>Add your cookie to cookie.json using: {'{ "cookie": "your_full_crunchy_cookie" }'}</p>
        </div>
      </section>
    );
  }

  if (watching.length === 0 && history.length === 0) {
    return (
      <section className="w-full bg-[#111] py-24 md:py-32 px-6 md:px-24 text-[#F0EDE5] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FF9E9E]/5 opacity-50 pointer-events-none"></div>
        <div className="flex flex-col gap-4 opacity-60 relative z-10">
          <span className="uppercase text-sm font-bold tracking-[0.2em] font-mono text-[#FF9E9E]">Anime / Empty</span>
          <p>No Crunchy history detected from this cookie right now.</p>
        </div>
      </section>
    );
  }

  return (
    <AnimeHoverList watching={watching} history={history} />
  );
}
