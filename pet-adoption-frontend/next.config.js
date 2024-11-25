/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: 'out', // Directory for static exports
};

// Check the environment and conditionally add output: 'export'
if (process.env.NEXT_PHASE === 'phase-export' || process.env.STATIC_EXPORT) {
  nextConfig.output = 'export'; // Only enable for static export
}

module.exports = nextConfig;