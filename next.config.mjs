/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // bật strict mode để debug
  images: {
    domains: ["res.cloudinary.com", "avatars.githubusercontent.com"],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizeCss: true, // tối ưu CSS
    // serverActions: {}, // chỉ bật nếu bạn thật sự dùng Server Actions
  },
  output: "export", // build ra static HTML (frontend only)
};

export default nextConfig;
