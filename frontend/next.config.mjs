/** @type {import('next').NextConfig} */
const nextConfig = {
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
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
    ],
  },
  // Enable React Strict Mode
  reactStrictMode: true,
  // Turbopack configuration
  experimental: {
    turbo: {
      // Turbopack specific settings
    },
  },
};

export default nextConfig;
