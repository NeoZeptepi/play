import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",          // tells Next.js to do a static export
  images: { unoptimized: true }, // disables the image optimizer so static export works
  trailingSlash: true,   // 👈 key
};

export default nextConfig;