/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

import NextBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["react-leaflet-cluster"],

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    minimumCacheTTL: 60 * 60, // 1 hour
    remotePatterns: [
      {
        hostname: "sadfrogs.s3.ap-southeast-2.amazonaws.com",
      },
      {
        hostname: "dh0bdxvf05sxo.cloudfront.net",
      },
    ],
  },
};

export default withBundleAnalyzer(config);
