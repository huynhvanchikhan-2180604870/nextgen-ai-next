/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "avatars.githubusercontent.com"],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {},
};

export default nextConfig;
