const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
  transpilePackages: [
    "@ultralocal/ui",
    "@ultralocal/database",
    "@ultralocal/utils",
  ],
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
