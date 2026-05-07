import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.monkeycode-ai.online"],
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
