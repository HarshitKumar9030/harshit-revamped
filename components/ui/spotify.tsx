import { getCurrentPlayingSong } from "@/lib/spotify";
import { SpotifyClient } from "./spotify-client";

export async function SpotifyTracker() {
  const song = await getCurrentPlayingSong();
  return <SpotifyClient song={song} />;
}
