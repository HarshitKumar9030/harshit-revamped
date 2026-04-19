import { CrunchyrollClient } from "crunchy-api";
import { Play } from "lucide-react";
import { getBestImageSource, getItemId, pickString, readCookieFromJson } from "@/components/sections/crunchy-helpers";

type EpisodeLoadResult =
  | { status: "ok"; episode: unknown }
  | { status: "empty" }
  | { status: "error" };

async function loadEpisode(preferredEpisodeId: string): Promise<EpisodeLoadResult> {
  try {
    const client = new CrunchyrollClient();
    await client.getAnonymousToken();

    let resolvedEpisodeId = preferredEpisodeId;
    let episode: unknown = null;

    if (resolvedEpisodeId) {
      episode = await client.getEpisodeInfo(resolvedEpisodeId).catch(() => null);
    }

    // If env id is stale, resolve a fresh episode id from authenticated history.
    if (!episode) {
      const cookie = (await readCookieFromJson()) || process.env.CRUNCHYROLL_COOKIE || "";

      if (cookie) {
        const authClient = new CrunchyrollClient();
        await authClient.authenticateWithRtCookie({ cookie });

        const history = await authClient
          .getWatchHistory({ page_size: 1, page: 1 })
          .catch(() => ({ data: [] as unknown[] }));
        const current = await authClient
          .getCurrentlyWatching({ page_size: 1, page: 1 })
          .catch(() => ({ data: [] as unknown[] }));

        resolvedEpisodeId =
          getItemId(history.data[0])
          || getItemId(current.data[0])
          || resolvedEpisodeId;

        if (resolvedEpisodeId) {
          episode = await authClient.getEpisodeInfo(resolvedEpisodeId).catch(() => null);
        }
      }
    }

    if (!episode) {
      return { status: "empty" };
    }

    return { status: "ok", episode };
  } catch {
    return { status: "error" };
  }
}

export async function CrunchyEpisode({ id }: { id?: string }) {
  const preferredEpisodeId = id || process.env.CRUNCHYROLL_EPISODE_ID || "";
  const result = await loadEpisode(preferredEpisodeId);

  if (result.status === "error") {
    return (
      <div className="my-12 p-8 bg-red-100/50 rounded-3xl">
        <p className="text-red-800 text-sm font-bold">Failed to load episode data. Check cookie validity and fallback id resolution.</p>
      </div>
    );
  }

  if (result.status === "empty") {
    return (
      <div className="my-12 p-8 bg-amber-100/60 rounded-3xl">
        <p className="text-amber-800 text-sm font-bold">No episode payload returned. The configured id may be stale and no fallback id could be resolved.</p>
      </div>
    );
  }

  const episode = result.episode;
  const metadata: unknown = (episode as { episode_metadata?: unknown }).episode_metadata ?? episode;
  const seriesTitle =
    pickString(metadata, [["series_title"], ["title"], ["episode_title"]])
    || "Unknown Series";
  const episodeTitle =
    pickString(episode, [["title"], ["episode_title"], ["slug_title"]])
    || "Episode";
  const epNumberValue = pickString(metadata, [["episode_number"]]);
  const seasonNumberValue = pickString(metadata, [["season_number"]]);
  const epNumber = epNumberValue ? `E${epNumberValue}` : "";
  const seasonNumber = seasonNumberValue ? `S${seasonNumberValue}` : "";
  const snNumberText = [seasonNumber, epNumber].filter(Boolean).join(" ");

  const thumbnail = getBestImageSource((episode as { images?: unknown }).images);

  return (
    <div className="my-12 w-full max-w-2xl bg-[#EAE5D9] rounded-3xl overflow-hidden group flex flex-col md:flex-row">
      {thumbnail && (
        <div className="w-full md:w-2/5 aspect-video md:aspect-auto relative overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={thumbnail} 
            alt={String(episodeTitle)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[#111111]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 bg-[#FDFBF7] rounded-full flex items-center justify-center">
              <Play className="w-5 h-5 text-[#111111] translate-x-0.5" />
            </div>
          </div>
        </div>
      )}
      <div className="p-6 md:p-8 flex flex-col justify-center gap-2 w-full">
        <div className="flex justify-between items-start w-full">
          <span className="uppercase text-[10px] font-bold tracking-widest text-[#111111]/40">{String(seriesTitle)}</span>
          <span className="uppercase text-[10px] font-bold tracking-widest text-[#111111]/40">{snNumberText}</span>
        </div>
        <h4 className="text-xl md:text-2xl font-black text-[#111111] leading-tight mt-1" style={{ fontFamily: "var(--font-heading)" }}>
          {String(episodeTitle)}
        </h4>
        {Boolean((episode as { description?: unknown }).description) && (
          <p className="text-xs text-[#111111]/60 line-clamp-2 mt-2 leading-relaxed">
            {String((episode as { description?: unknown }).description)}
          </p>
        )}
      </div>
    </div>
  );
}
