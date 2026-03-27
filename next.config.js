/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
      return [
          {
              source: '/bmm/:path*',
              destination: 'https://benchmark-mondays.vercel.app/bmm/:path*',
          },
      ];
  },
}

module.exports = nextConfig
