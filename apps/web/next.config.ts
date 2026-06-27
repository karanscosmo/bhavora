import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['mapbox-gl'],
  experimental: {
    optimizePackageImports: ['recharts', 'lucide-react', 'framer-motion', 'mapbox-gl'],
  },
};

export default nextConfig;
