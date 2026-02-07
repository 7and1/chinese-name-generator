import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

// Content Security Policy configuration
const getDevCsp = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return [
    "default-src 'none'", // Most restrictive default
    // Use hash-based CSP instead of nonce for better compatibility
    isProduction
      ? "script-src 'self' 'unsafe-inline'"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'", // Development requires unsafe-eval for Next.js HMR
    // Style sources - requires unsafe-inline for CSS-in-JS
    "style-src 'self' 'unsafe-inline'",
    // Image sources with explicit allowlist
    "img-src 'self' data: blob: https://*.githubusercontent.com https://picsum.photos",
    // Font sources
    "font-src 'self' data:",
    // Connect sources - restrict to same origin and required external services
    "connect-src 'self' https://*.githubusercontent.com",
    // Media sources
    "media-src 'self'",
    // Object/embed sources - block all
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    // Enforce HTTPS
    "upgrade-insecure-requests",
    // Block mixed content
    "block-all-mixed-content",
    // Protect against DOM XSS via Trusted Types
    "require-trusted-types-for 'script'",
    // Allow Trusted Types policy for Next.js internals
    "trusted-types nextjs nextjs#bundler",
    // Sandbox restrictions for iframe content (if any)
    "sandbox allow-forms allow-scripts allow-same-origin allow-popups",
  ]
    .filter(Boolean)
    .join("; ");
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  // Enable standalone output for Docker deployment
  output: "standalone",

  // Performance: Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Memory optimization for development
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 3,
  },

  // Turbopack configuration (replaces experimental.turbo)
  turbopack: {
    resolveAlias: {
      "@": ".",
    },
  },

  // Performance: Optimize bundle size
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
    // Remove react propTypes in production
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },

  // Performance: Code splitting and bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize chunk splitting for better caching
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            // Split vendor code
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              priority: 10,
            },
            // Split heavy libraries into separate chunks
            lunar: {
              test: /[\\/]node_modules[\\/]lunar-javascript[\\/]/,
              name: "lunar",
              priority: 20,
            },
            pinyin: {
              test: /[\\/]node_modules[\\/]pinyin-pro[\\/]/,
              name: "pinyin",
              priority: 20,
            },
            recharts: {
              test: /[\\/]node_modules[\\/]recharts[\\/]/,
              name: "recharts",
              priority: 20,
            },
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: "framer-motion",
              priority: 20,
            },
            // UI framework
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: "radix-ui",
              priority: 15,
            },
          },
        },
      };
    }

    return config;
  },

  // Performance: Experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "framer-motion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
    ],
  },

  async headers() {
    const contentSecurityPolicy = getDevCsp();

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: [
              "accelerometer=()",
              "ambient-light-sensor=()",
              "autoplay=()",
              "battery=()",
              "bluetooth=()",
              "camera=()",
              "clipboard-read=()",
              "clipboard-write=()",
              "display-capture=()",
              "document-domain=()",
              "encrypted-media=()",
              "execution-while-not-rendered=()",
              "execution-while-out-of-viewport=()",
              "fullscreen=(self)",
              "geolocation=()",
              "gyroscope=()",
              "hid=()",
              "idle-detection=()",
              "interest-cohort=()",
              "magnetometer=()",
              "microphone=()",
              "midi=()",
              "navigation-override=()",
              "payment=()",
              "picture-in-picture=()",
              "publickey-credentials-get=()",
              "screen-wake-lock=()",
              "serial=()",
              "speaker-selection=()",
              "sync-xhr=()",
              "usb=()",
              "vibrate=()",
              "vr=()",
              "wake-lock=()",
              "web-share=()",
              "xr-spatial-tracking=()",
            ].join(", "),
          },
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // Additional security headers
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          // Additional privacy and security headers
          {
            key: "Sec-GPC",
            value: "1",
          },
          {
            key: "Expect-CT",
            value: "max-age=86400, enforce",
          },
          {
            key: "Reporting-Endpoints",
            value:
              process.env.NODE_ENV === "production"
                ? "csp-endpoint='/api/reports/security'"
                : "",
          },
          // Performance: Caching headers for static assets
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Static assets caching
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Images caching
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Stricter headers for API routes (no caching)
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
