/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
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
