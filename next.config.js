/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/admin/semester/list',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
