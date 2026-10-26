/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react'],
  experimental: {
    serverComponentsExternalPackages: ['mysql2'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.backblazeb2.com',
      },
    ],
  },
};

export default nextConfig;
