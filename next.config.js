const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

module.exports = nextConfig;
