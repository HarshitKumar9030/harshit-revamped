import { CrunchyrollClient } from "crunchy-api";
import { ArrowUpRight } from "lucide-react";
import { getItemId, pickString, readCookieFromJson } from "@/components/sections/crunchy-helpers";

export async function CrunchyLists() {
  const cookieFromJson = await readCookieFromJson();
  const cookie = cookieFromJson || process.env.CRUNCHYROLL_COOKIE || "";

  if (!cookie) {
    return (
      <div className="w-full my-12 bg-[#F6F4EE]/50 rounded-3xl p-8 md:p-12 flex flex-col gap-4">
        <span className="uppercase text-xs font-bold tracking-[0.2em] text-[#111111]/40">Live Data / Crunchylists</span>
        <p className="text-[#111111]/60 font-medium">Add your cookie to cookie.json to view your Crunchylists here.</p>
      </div>
    );
  }

  try {
    const client = new CrunchyrollClient();
    await client.authenticateWithRtCookie({ cookie });
    const lists = await client.getCrunchylists();

    if (!lists.data || lists.data.length === 0) {
      return (
        <div className="w-full my-12 bg-[#F6F4EE]/50 rounded-3xl p-8 md:p-12 flex flex-col gap-4">
          <span className="uppercase text-xs font-bold tracking-[0.2em] text-[#111111]/40">Live Data / Crunchylists</span>
          <p className="text-[#111111]/60 font-medium">Connected, but no custom Crunchylists were found on this account.</p>
        </div>
      );
    }

    // Resolve list id from env first, then from first payload item (including nested panel.id)
    const firstList = lists.data[0];
    const discoveredListId = getItemId(firstList) ?? getItemId(lists.data.find((entry) => Boolean(getItemId(entry))));
    const listId = process.env.CRUNCHYROLL_LIST_ID?.trim() || discoveredListId;

    if (!listId) {
      return (
        <div className="w-full my-12 bg-[#F6F4EE]/50 rounded-3xl p-8 md:p-12 flex flex-col gap-4">
          <span className="uppercase text-xs font-bold tracking-[0.2em] text-[#111111]/40">Live Data / Crunchylists</span>
          <p className="text-[#111111]/60 font-medium">A list was found, but no usable list id was returned by the API payload.</p>
        </div>
      );
    }

    const itemsResponse = await client.getCrunchylistItems(listId, { page_size: 4 });
    const items = itemsResponse.data;

    return (
      <div className="w-full my-12 bg-[#F6F4EE]/50 rounded-3xl p-8 md:p-12">
        <div className="flex flex-col gap-2 mb-8">
          <span className="uppercase text-xs font-bold tracking-[0.2em] text-[#111111]/40">Live Data / Crunchylists</span>
          <h3 className="text-3xl font-black text-[#111111] uppercase tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>
            {String(pickString(firstList, [["title"], ["panel", "title"], ["slug_title"], ["panel", "slug_title"]]) || "My Watchlist")}
          </h3>
          <p className="text-[#111111]/60 font-medium">Currently has {String(firstList.total || items.length)} saved shows.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item: any, i: number) => {
            const itemData = item.panel || item;
            const title =
              pickString(itemData, [["title"], ["slug_title"], ["series_title"], ["episode_title"]])
              || "Unknown Show";
            const hrefId = getItemId(itemData);
            return (
              <a 
                key={String(hrefId || i)}
                href={hrefId ? `https://crunchyroll.com/series/${hrefId}` : `https://crunchyroll.com/search?q=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-3 group p-6 bg-white rounded-2xl hover:-translate-y-1 transition-all"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-xl font-bold text-[#111111] group-hover:text-blue-600 transition-colors leading-tight">
                    {title}
                  </h4>
                  <ArrowUpRight className="w-4 h-4 text-[#111111]/30 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-[#111111]/40">Item {i + 1}</span>
              </a>
            );
          })}
        </div>
      </div>
    );
  } catch {
    return (
      <div className="w-full my-12 bg-red-100/60 rounded-3xl p-8 md:p-12 flex flex-col gap-4">
        <span className="uppercase text-xs font-bold tracking-[0.2em] text-red-700/80">Live Data / Crunchylists</span>
        <p className="text-red-800 font-medium">Could not fetch Crunchylists right now. Re-check your cookie and env values, then refresh.</p>
      </div>
    );
  }
}
