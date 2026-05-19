/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: ["192.168.0.102", "192.168.0.105", "192.168.0.101", "192.168.0.101:3000", "http://192.168.0.101:3000"],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    if (!dev && !isServer) {
      config.optimization.mangleWasmImports = false;
      if (config.optimization.minimizer) {
        config.optimization.minimizer.forEach((minimizer) => {
          // For Next.js 16+, Turbopack is default, but Webpack can still be configured.
          // Ensure we are targeting the correct minimizer (Terser for webpack).
          if (minimizer.options && minimizer.options.minify && minimizer.options.terserOptions) {
            minimizer.options.terserOptions = {
              ...minimizer.options.terserOptions,
              mangle: false, // Disable mangling for physics properties
              keep_classnames: true,
              keep_fnames: true,
            };
          } else if (minimizer.options && minimizer.options.esbuildOptions) {
            // If Esbuild is used (e.g., in a custom setup or future Next.js version)
            minimizer.options.esbuildOptions = {
              ...minimizer.options.esbuildOptions,
              minify: false, // Esbuild equivalent for disabling mangling
              keepNames: true, // Keep class and function names
            };
          }
        });
      }
    }
    return config;
  },
};

module.exports = nextConfig;
