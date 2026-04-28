import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        // Force apex canonical: www.juristea.com → juristea.com
        // Keeps OAuth redirect_uri stable across hosts.
        source: "/:path*",
        has: [{ type: "host", value: "www.juristea.com" }],
        destination: "https://juristea.com/:path*",
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
