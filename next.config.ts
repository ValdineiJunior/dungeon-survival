import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/game", destination: "/", permanent: true }];
  },
};

export default nextConfig;
