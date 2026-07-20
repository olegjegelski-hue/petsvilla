const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  // Next.js 15: outputFileTracingRoot moved out of experimental
  outputFileTracingRoot: path.join(__dirname),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // next/image optimeerimine sisse (LCP). Dünaamilised Notion/S3 hostid allpool.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Notion failid (allkirjastatud S3 URL-id)
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'file.notion.so',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.notion.so',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'notion.so',
        pathname: '/**',
      },
      // Mõned Notion välised / legacy hostid
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/merisead',
        destination: '/meriseabeebid',
        permanent: true, // 301
      },
    ]
  },
};

module.exports = nextConfig;
