import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [],
    unoptimized: true, // For local SVG files in public folder
  },
};

export default nextConfig;
