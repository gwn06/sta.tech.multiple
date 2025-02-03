import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint:{
    ignoreDuringBuilds: true
  },
  
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qkvdejyfjwkpsxitpzkf.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
