/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignorujeme typescript chyby během buildu pro produkci
  typescript: {
    ignoreBuildErrors: true,
  },
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
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Povolíme upload větších fotek
    },
  },
};

export default nextConfig;