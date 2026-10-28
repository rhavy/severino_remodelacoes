/** @type {import('next').NextConfig} */
const nextConfig = {
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