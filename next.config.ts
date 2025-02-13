import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'lh3.googleusercontent.com',
      },
      { hostname: 'avatar.vercel.sh' },
      {
        hostname: 'utfs.io',
      },
    ], // Add the domain here
  },
};

export default nextConfig;
