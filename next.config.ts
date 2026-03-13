import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Optimisations de performance
  reactStrictMode: true,
  
  // Configuration compiler pour optimiser la production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  turbopack: {},
}

export default nextConfig
