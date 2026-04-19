import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // dribble
      {
        protocol: "https",
        hostname: "cdn.dribbble.com",
        
      },
      // spotify
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
      // https://static0.cbrimages.com/wordpress/wp-content/uploads/2020/11/Crunchyroll-Hime-.jpg
      {
        protocol: "https",
        hostname: "static0.cbrimages.com",
      },
      //https://cdn.mos.cms.futurecdn.net/L8exumuVUaJatGHCPDRuQm-2048-80.jpg
      {
        protocol: "https",
        hostname: "cdn.mos.cms.futurecdn.net",
      },
      {
        protocol: "https",
        hostname: "i.cdn.newsbytesapp.com",
      },
    ],
  },
};

export default nextConfig;
