/** @type {import('next').NextConfig} */
const nextConfig = {
  // Povolení obrázků z externích zdrojů (Unsplash, Cloudinary)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;