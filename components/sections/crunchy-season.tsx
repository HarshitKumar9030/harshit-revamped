import { CrunchyrollClient } from "crunchy-api";
import { Copy } from "lucide-react";
import { getBestImageSource, getItemId, getSeasonId, pickString, readCookieFromJson } from "@/components/sections/crunchy-helpers";

export async function CrunchySeason({ id }: { id?: string }) {
  const preferredSeasonId = id || process.env.CRUNCHYROLL_SEASON_ID || "GDKHZEJ0K";
  
  try {
    const client = new CrunchyrollClient();
    await client.getAnonymousToken();

    const trySeason = async (seasonId: string) =>
      client.getSeasonEpisodes(seasonId, { n: 4, start: 0 }).catch(() => null);

    let resolvedSeasonId = preferredSeasonId;
    let season = resolvedSeasonId ? await trySeason(resolvedSeasonId) : null;

    // Fallback: derive season id from configured episode id.
    if (!season) {
      const configuredEpisodeId = process.env.CRUNCHYROLL_EPISODE_ID?.trim() || "";
      if (configuredEpisodeId) {
        const episode = await client.getEpisodeInfo(configuredEpisodeId).catch(() => null);
        const seasonFromEpisode = getSeasonId(episode);
        if (seasonFromEpisode) {
          resolvedSeasonId = seasonFromEpisode;
          season = await trySeason(resolvedSeasonId);
        }
      }
    }

    // Final fallback: derive episode id from authenticated history, then derive season id.
    if (!season) {
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

        const episodeId = getItemId(history.data[0]) || getItemId(current.data[0]);

        if (episodeId) {
          const episode = await authClient.getEpisodeInfo(episodeId).catch(() => null);
          const seasonFromEpisode = getSeasonId(episode);

          if (seasonFromEpisode) {
            resolvedSeasonId = seasonFromEpisode;
            season = await authClient
              .getSeasonEpisodes(resolvedSeasonId, { n: 4, start: 0 })
              .catch(() => null);
          }
        }
      }
    }

    const episodes = season?.data || [];
    
    if (!episodes || episodes.length === 0) {
      return (
        <div className="my-12 p-8 bg-amber-100/60 rounded-3xl">
          <p className="text-amber-800 text-sm font-bold">No episodes were returned. The configured season id may be stale and fallback resolution failed.</p>
        </div>
      );
    }

    const firstEpisode = episodes[0] as unknown;
    const seriesTitle =
      pickString(firstEpisode, [["episode_metadata", "series_title"], ["series_title"], ["title"]])
      || "Unknown Series";
    const seasonNumber =
      pickString(firstEpisode, [["episode_metadata", "season_number"], ["season_number"]])
      || "?";

    return (
      <div className="w-full my-12 bg-[#F6F4EE]/50 rounded-3xl p-8 md:p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#DBC2FC]/20 rounded-full blur-3xl z-0"></div>
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex flex-col gap-2">
            <span className="uppercase text-[10px] font-bold tracking-[0.2em] text-[#111111]/40">Live Data / Season Episodes</span>
            <h3 className="text-2xl md:text-3xl font-black text-[#111111] uppercase tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>
              {String(seriesTitle)} (S{String(seasonNumber)})
            </h3>
          </div>
          <div className="w-10 h-10 bg-[#EAE5D9] rounded-full flex items-center justify-center">
            <Copy className="w-4 h-4 text-[#111111]/60" />
          </div>
        </div>

        <div className="flex flex-col gap-3 relative z-10">
          {episodes.map((ep: any, index: number) => {
            const episodeTitle =
              pickString(ep, [["title"], ["episode_title"], ["slug_title"]])
              || "Episode";
            const thumbnail = getBestImageSource(ep.images);
            const epIndex =
              pickString(ep, [["episode_metadata", "episode_number"], ["episode_number"]])
              || String(index + 1);

            return (
              <div 
                key={String(getItemId(ep) || index)}
                className="flex items-center gap-4 p-4 md:p-6 bg-white rounded-2xl hover:-translate-y-1 transition-all group cursor-pointer"
              >
                {thumbnail ? (
                   <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 aspect-video md:aspect-square relative rounded-xl overflow-hidden">
                     <img src={thumbnail} alt={String(episodeTitle)} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                     <div className="absolute inset-0 bg-[#D9ED92]/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   </div>
                ) : (
                   <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 aspect-square bg-[#EAE5D9] rounded-xl flex items-center justify-center">
                     <span className="font-mono text-xs opacity-30">{String(epIndex)}</span>
                   </div>
                )}
                
                <div className="flex flex-col gap-1 w-full overflow-hidden">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="text-sm md:text-base font-bold text-[#111111] truncate max-w-[80%]">
                      {String(epIndex)}. {String(episodeTitle)}
                    </h4>
                    <span className="text-[10px] font-bold text-[#111111] opacity-30 group-hover:opacity-60 transition-opacity">EP</span>
                  </div>
                  {Boolean(ep.description) && (
                    <p className="text-[10px] md:text-xs text-[#111111]/50 truncate w-full">
                      {String(ep.description)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } catch {
    return (
      <div className="my-12 p-8 bg-red-100/50 rounded-3xl">
        <p className="text-red-800 text-sm font-bold">Failed to load season data. Check cookie validity and fallback id resolution.</p>
      </div>
    );
  }
}
