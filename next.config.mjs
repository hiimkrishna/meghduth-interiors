/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  // ভারী প্যাকেজের ব্যারেল-ইমপোর্ট ছেঁটে বান্ডেল হালকা রাখা
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  // Enforce Next.js image optimization pipeline rules
  images: {
    qualities: [75, 80],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;