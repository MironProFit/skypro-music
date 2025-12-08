import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/music/main',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
