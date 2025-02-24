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
      {
        hostname: 'gravatar.com',
      },
    ],
  },
};

export default nextConfig;
