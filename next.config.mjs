/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'canvas', 'worker_threads', 'audio-context'];
    return config;
  },
  transpilePackages: [
    'scratch-gui',
    'scratch-blocks',
    'scratch-vm',
    'scratch-render',
    'scratch-svg-renderer',
    'scratch-storage',
    'scratch-audio',
    'scratch-paint'
  ],
};

export default nextConfig;
