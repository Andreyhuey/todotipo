/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Media is resized and converted to WebP by the API on upload, so the
    // files are served as-is rather than through the Next image optimizer.
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
