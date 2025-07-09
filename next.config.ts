/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.cloudflare.steamstatic.com',
        port: '',
        pathname: '/steam/apps/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.steamstatic.com',
        port: '',
        pathname: '/steam/apps/**',
      },
      {
        protocol: 'https',
        hostname: 'static0.gamerantimages.com',
        port: '',
        pathname: '/wordpress/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'xboxwire.thesourcemediaassets.com',
        port: '',
        pathname: '/sites/**',
      },
      {
        protocol: 'https',
        hostname: 'shared.fastly.steamstatic.com',
        port: '',
        pathname: '/store_item_assets/**',
      },
      { // AÑADE ESTE PATRÓN PARA IMÁGENES DE RAWG si no está
        protocol: 'https',
        hostname: 'media.rawg.io',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
};

module.exports = nextConfig;