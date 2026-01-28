import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Optimisations de performance
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuration compiler pour optimiser la production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Configuration pour supporter les fichiers Markdown, les images et react-pdf
  webpack: (config: any, { isServer }) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    
    // Configuration pour react-pdf
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    }
    
    // Optimisations webpack
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20
            },
            // Framer Motion dans son propre chunk
            framerMotion: {
              name: 'framer-motion',
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              priority: 30,
            },
            // Lenis dans son propre chunk
            lenis: {
              name: 'lenis',
              test: /[\\/]node_modules[\\/]lenis[\\/]/,
              priority: 30,
            },
            // Common chunks
            common: {
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }
    
    return config
  },
}

export default nextConfig
