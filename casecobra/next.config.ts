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
};

export default nextConfig;
