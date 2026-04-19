import "server-only";

const SPOTIFY_CURRENTLY_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";

export type CurrentPlayback = {
  isPlaying: boolean;
  progressMs: number;
  timestampMs: number;
  durationMs: number;
  trackId: string;
  trackName: string;
  artists: string[];
  albumName: string;
  albumImageUrl: string | null;
  spotifyUrl: string | null;
};

type SpotifyImage = {
  url: string;
  height: number | null;
  width: number | null;
};

type SpotifyTrack = {
  id: string;
  name: string;
  duration_ms: number;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: SpotifyImage[];
  };
  external_urls?: {
    spotify?: string;
  };
};

type SpotifyCurrentlyPlayingResponse = {
  is_playing: boolean;
  progress_ms: number | null;
  timestamp: number;
  currently_playing_type: string;
  item: SpotifyTrack | null;
};

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

async function getAccessToken() {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!client_id || !client_secret || !refresh_token) {
    if (process.env.SPOTIFY_ACCESS_TOKEN) {
      return process.env.SPOTIFY_ACCESS_TOKEN;
    }
    throw new Error("Missing Spotify credentials in env.");
  }

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Spotify access token");
  }

  const data = await response.json();
  return data.access_token as string;
}

export async function getCurrentPlayingSong(): Promise<CurrentPlayback | null> {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(SPOTIFY_CURRENTLY_PLAYING_ENDPOINT, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      const body = await response.text();
      return null; // Gracefully fail if spotify errors out instead of crashing the site
    }

    const payload =
      (await response.json()) as SpotifyCurrentlyPlayingResponse | null;

    if (!payload || payload.currently_playing_type !== "track" || !payload.item) {
      return null;
    }

    const track = payload.item;

    return {
      isPlaying: payload.is_playing,
      progressMs: payload.progress_ms ?? 0,
      timestampMs: payload.timestamp,
      durationMs: track.duration_ms,
      trackId: track.id,
      trackName: track.name,
      artists: track.artists.map((artist) => artist.name),
      albumName: track.album.name,
      albumImageUrl: track.album.images[0]?.url ?? null,
      spotifyUrl: track.external_urls?.spotify ?? null,
    };
  } catch (error) {
    return null; // Return null if Spotify auth misses credentials
  }
}