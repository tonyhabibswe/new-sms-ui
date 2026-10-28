/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build a self-contained server in .next/standalone for the Docker image
  output: 'standalone',
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
        destination: '/admin/semesters/list',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
