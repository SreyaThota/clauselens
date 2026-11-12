import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/clauselens",
  assetPrefix: "/clauselens",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
