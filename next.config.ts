import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",          // tells Next.js to do a static export
  images: { unoptimized: true }, // disables the image optimizer so static export works
  trailingSlash: true,   // 👈 key
  // Legacy vendor files (minified jQuery UI etc.) cause many ESLint errors during
  // static builds. Ignore ESLint during builds so the export can complete and we
  // can deploy the static output. This is safe for a static export of legacy
  // client-side assets.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;