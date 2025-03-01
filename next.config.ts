import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.resolve.modules.push(__dirname);
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    domains: [
      "irc7idfkyhk1igoi.public.blob.vercel-storage.com",
      "example.com",
      "anotherdomain.com",
    ],
  },
};

export default nextConfig;
