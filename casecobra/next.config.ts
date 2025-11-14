import type { NextConfig } from "next";

const KINDE_DEFAULT_URL = process.env.KINDE_SITE_URL || 'http://localhost:3000';
let VERCEL_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : KINDE_DEFAULT_URL;
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ufs.sh", // allows any subdomain (e.g., z568k22i78.ufs.sh)
      },
      {
        protocol: "https",
        hostname: "utfs.io", // also allow utfs.io (UploadThing sometimes uses it)
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        // Apply these headers to all requests to your /api/auth routes
        source: "/api/auth/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            // In production, use the exact domain. For simplicity on Vercel, use *
            // to allow your domain to call itself.
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  env: {
    // 1. Prioritize a manually set KINDE_SITE_URL (e.g., in Vercel settings)
    // 2. Fall back to the dynamic VERCEL_URL if available
    // 3. Finally, fall back to http://localhost:3000 (which you manually set as KINDE_SITE_URL locally)
    KINDE_SITE_URL: VERCEL_URL, 
    KINDE_POST_LOGOUT_REDIRECT_URL: VERCEL_URL,
    // The redirect URL must include the callback path
    KINDE_POST_LOGIN_REDIRECT_URL: `${VERCEL_URL}/api/auth/kinde_callback`, 
  }
};

export default nextConfig;
