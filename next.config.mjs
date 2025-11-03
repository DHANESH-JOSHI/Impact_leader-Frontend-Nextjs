/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    skipTrailingSlashRedirect: true,
  },
  generateBuildId: async () => {
    return 'my-build-id'
  },
};

export default nextConfig;
