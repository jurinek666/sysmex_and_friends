/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Optimalizace obrázků (nový formát)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    serverActions: {}, // nyní musí být objekt, ne boolean
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  // Nový způsob pro standalone výstup
  output: "standalone",
};

export default nextConfig;
