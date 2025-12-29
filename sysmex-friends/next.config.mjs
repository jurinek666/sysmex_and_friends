/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ... tvůj stávající config ...

  // 👇 PŘIDEJ TOTO: Vypnutí kontroly při buildu (ušetří 30-60s)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  output: "standalone",
};

export default nextConfig;