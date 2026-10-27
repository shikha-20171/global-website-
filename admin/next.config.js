/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: "/admin", destination: "/" },
      { source: "/admin/:path*", destination: "/:path*" },
    ];
  },
};

module.exports = nextConfig;
