import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@specforge/shared"],
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
