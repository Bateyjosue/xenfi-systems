import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // Remove trailing slash to prevent double slashes in destination
    backendUrl = backendUrl.replace(/\/$/, '');
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`, // Since backendUrl already has /api suffix
      },
    ];
  },
};

export default nextConfig;
