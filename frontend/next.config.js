/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/admin",
        destination: "http://localhost:3001/admin",
      },
      {
        source: "/admin/:path*",
        destination: "http://localhost:3001/admin/:path*",
      },
    ];
  },
};
module.exports = nextConfig;

