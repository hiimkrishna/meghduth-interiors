/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enforce Next.js image optimization pipeline rules
  images: {
    qualities: [75, 80],
  },
};

export default nextConfig;