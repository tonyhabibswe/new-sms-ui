/** @type {import('next').NextConfig} */
const nextConfig = {
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
