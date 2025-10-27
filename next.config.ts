import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-expect-error -- allowedDevOrigins is experimental in newer versions
    allowedDevOrigins: [
      "https://rc8wc0o080kc4kc4ck8sok48.62.72.57.193.sslip.io",
    ],
  },
};

export default nextConfig;
