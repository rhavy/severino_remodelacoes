/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  eslint: {
    // Ignora erros do ESLint durante o build de produção na VPS
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora erros de tipagem estrita durante o build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;