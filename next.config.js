/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["res.cloudinary.com", "bit.ly", "lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
