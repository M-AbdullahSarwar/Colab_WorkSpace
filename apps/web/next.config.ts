import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@colab/shared", "@colab/db"],
  serverExternalPackages: ["@prisma/adapter-pg", "pg"],
};

export default nextConfig;
