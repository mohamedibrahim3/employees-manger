import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["bcryptjs"],
  },
  images: {
    domains: [
      "files.edgestore.dev", // Add your image domains here
      "localhost",
      "127.0.0.1",
      // Add other domains where your images are hosted
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
      },
      {
        protocol: "https",
        hostname: "**.edgestore.dev",
      },
    ],
  },
};

export default nextConfig;
