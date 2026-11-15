import { randomBytes } from "node:crypto";
import { createServer } from "node:http";

const redirectUri = "http://127.0.0.1:8888/callback";
const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret } = process.env;
const supportedScopes = new Set([
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-recently-played",
]);
const scopes = process.argv.slice(2);
if (scopes.length === 0) scopes.push("user-read-currently-playing");

if (!clientId || !clientSecret || scopes.some((scope) => !supportedScopes.has(scope))) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET. Optional arguments must be Spotify playback read scopes.");
  process.exit(1);
}

const state = randomBytes(32).toString("hex");
const authorize = new URL("https://accounts.spotify.com/authorize");
authorize.search = new URLSearchParams({
  client_id: clientId,
  response_type: "code",
  redirect_uri: redirectUri,
  scope: [...new Set(scopes)].join(" "),
  state,
}).toString();

let exchanging = false;
const server = createServer(async (req, res) => {
  const callback = new URL(req.url ?? "/", redirectUri);
  if (req.method !== "GET" || callback.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }
  if (callback.searchParams.get("state") !== state) {
    res.writeHead(400).end("Invalid authorization state. Use the URL printed by the script.");
    return;
  }
  if (exchanging) {
    res.writeHead(409).end("Authorization is already being processed.");
    return;
  }
  exchanging = true;

  try {
    const code = callback.searchParams.get("code");
    if (callback.searchParams.has("error") || !code) {
      throw new Error("Spotify authorization was denied or did not return a code.");
    }

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`Spotify token exchange failed (HTTP ${response.status}).`);
    const { refresh_token: refreshToken } = await response.json();
    if (typeof refreshToken !== "string" || !refreshToken) {
      throw new Error("Spotify did not return a refresh token.");
    }
    res.writeHead(200, { "Cache-Control": "no-store" }).end("Authorized. Return to your terminal for the refresh token.");
    console.log(`SPOTIFY_REFRESH_TOKEN=${refreshToken}`);
  } catch (error) {
    process.exitCode = 1;
    res.writeHead(400, { "Cache-Control": "no-store" }).end("Authorization failed. Check the terminal.");
    console.error(error instanceof Error ? error.message : "Token exchange failed.");
  } finally {
    clearTimeout(timeout);
    server.close();
  }
});

const timeout = setTimeout(() => {
  console.error("Authorization timed out. Run the script again.");
  process.exitCode = 1;
  server.close();
}, 5 * 60_000);

server.on("error", (error) => {
  clearTimeout(timeout);
  console.error(`Could not listen on ${redirectUri}: ${error.code ?? "unknown error"}.`);
  process.exitCode = 1;
});

server.listen(8888, "127.0.0.1", () => {
  console.error(`Open this URL in your browser within five minutes:\n${authorize}`);
});
