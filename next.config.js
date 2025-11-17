/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.abacus.ai',
      },
      {
        protocol: 'https',
        hostname: 'static.abacusaicdn.net',
      },
    ],
  },
};

module.exports = nextConfig;
