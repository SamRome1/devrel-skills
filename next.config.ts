import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skill zips can contain many small files; allow larger server action / route bodies.
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
