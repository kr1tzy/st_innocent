// @ts-check

const path = require("path");

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*", // Proxy to Backend
        destination: "http://localhost:1111/:path*",
      },
    ];
  },
  transpilePackages: [],
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  //experimental: {
  //appDir: true,
  //},
};

//const withBundleAnalyzer = require("@next/bundle-analyzer")({
//enabled: true,
//});

//module.exports = withBundleAnalyzer(nextConfig);

module.exports = nextConfig;
