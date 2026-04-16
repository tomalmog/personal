/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: '/bmm',
                destination: 'https://bmm.tomalmog.com',
                permanent: true,
            },
            {
                source: '/bmm/:path*',
                destination: 'https://bmm.tomalmog.com/:path*',
                permanent: true,
            },
        ]
    },
    async rewrites() {
        return [
            {
                source: '/committrader',
                destination: '/committrader/index.html',
            },
        ]
    },
}

module.exports = nextConfig
