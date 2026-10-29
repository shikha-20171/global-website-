/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const rawBackend = (
      process.env.BACKEND_URL ||
      process.env.RENDER_URL ||
      process.env.RENDER_BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.NEXT_PUBLIC_RENDER_URL ||
      process.env.API_URL ||
      process.env.BACKEND_INTERNAL_URL ||
      (process.env.NODE_ENV !== "production" ? "http://127.0.0.1:5001" : "")
    ).trim();

    const rewrites = [
      { source: "/admin", destination: "/" },
      { source: "/admin/:path*", destination: "/:path*" },
    ];

    if (rawBackend) {
      const backendUrl = rawBackend.replace(/\/+$/, "");
      rewrites.push(
        {
          source: "/api/:path*",
          destination: `${backendUrl}/api/:path*`,
        },
        {
          source: "/uploads/:path*",
          destination: `${backendUrl}/uploads/:path*`,
        },
        {
          source: "/health",
          destination: `${backendUrl}/health`,
        }
      );
    }

    return rewrites;
  },
};

module.exports = nextConfig;
