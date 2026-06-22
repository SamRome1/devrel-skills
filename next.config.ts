import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The gallery reads the repo's skills/ folder at runtime. It isn't imported,
  // so tell Next's file tracing to bundle it into the deployment.
  outputFileTracingIncludes: {
    "/**": ["./skills/**/*"],
  },
};

export default nextConfig;
