/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
      return [
          {
              source: '/bmm/:path*',
              destination: 'https://benchmark-mondays-web.vercel.app/:path*',
          },
      ];
  },
}

module.exports = nextConfig
