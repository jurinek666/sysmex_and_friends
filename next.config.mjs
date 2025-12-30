/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Pro jistotu, kdybychom použili placeholder
      },
    ],
  },
  // Povolení server actions (ve verzi 15+ už je default, ale pro jistotu)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Zvětšíme limit pro upload fotek
    },
  },
};

export default nextConfig;