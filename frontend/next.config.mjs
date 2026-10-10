const nextConfig = {
  experimental: {
    optimizeCss: false,
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'https://rag-reliablity-backend.vercel.app';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig
