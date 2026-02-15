/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimalizace pro Docker a CI/CD (Render)
  output: "standalone",
  typescript: {
    // TypeScript chyby kontrolujeme v CI pipeline (npm run check),
    // takže zde můžeme ignorovat chyby při buildu pro robustnější deploy.
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