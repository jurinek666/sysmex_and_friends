/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  output: 'standalone',
  poweredByHeader: false,
  typescript: {
    // Checks are done via npm run check in CI/Build pipeline
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Povolíme upload větších fotek
    },
  },
};

export default nextConfig;