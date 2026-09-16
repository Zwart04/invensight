import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  webpack: (config) => { config.resolve.fallback = { fs: false }; return config; },
};
export default nextConfig;
