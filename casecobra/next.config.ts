import type { NextConfig } from "next";

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
    // This dynamically sets the SITE_URL based on the Vercel environment variable,
    // ensuring the protocol and domain are always correct for the current deployment.
    KINDE_SITE_URL: process.env.KINDE_SITE_URL || `https://${process.env.VERCEL_URL}`,
    // You should also set the others this way to be safe:
    KINDE_POST_LOGOUT_REDIRECT_URL: process.env.KINDE_POST_LOGOUT_REDIRECT_URL || `https://${process.env.VERCEL_URL}`,
    KINDE_POST_LOGIN_REDIRECT_URL: process.env.KINDE_POST_LOGIN_REDIRECT_URL || `https://${process.env.VERCEL_URL}/api/auth/kinde_callback`,
  },
};

export default nextConfig;
