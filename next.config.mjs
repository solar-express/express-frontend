/** @type  // API rewrites to proxy to backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },'next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // API rewrites to proxy to backend
  async rewrites() {
    // Use environment variable for backend URL, fallback to localhost for development
    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE ||
      process.env.BACKEND_URL ||
      "http://172.17.158.6:3000";

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ["@/components"],
    scrollRestoration: true,
  },

  // Remove console.logs in production (disabled for debugging)
  compiler: {
    // Temporarily disable console removal for debugging
    // removeConsole: process.env.NODE_ENV === "production",
  },

  // Enable compression
  compress: true,

  // Add cache headers for static assets to reduce edge requests
  async headers() {
    return [
      {
        // Cache favicon.ico aggressively to reduce repeated requests
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache all static assets in /public aggressively
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Optimize images for faster loading
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    domains: [
      "images.unsplash.com",
      "www.pv-magazine.com",
      "www.solarpowerworldonline.com",
      "www.energysage.com",
      "www.cleanenergyreviews.info",
      "cdn.shopify.com",
      "www.jinko.com",
      "www.canadiansolar.com",
      "www.longi.com",
      "www.tesla.com",
      "www.growatt.com",
      "www.sma-sunny.com",
      "encrypted-tbn0.gstatic.com",
      "img.freepik.com",
      "www.freepik.com",
      "www.solaredge.com",
      "www.solarpanelsnetwork.com",
      "www.solartechnology.co.uk",
      "www.solarpowereurope.org",
      "www.solarreviews.com",
      "www.solarchoice.net.au",
      "www.solarpanelstore.com",
      "cdn.pixabay.com",
      "images.pexels.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
