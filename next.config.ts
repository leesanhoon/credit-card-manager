/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
  env: {
    CARDS_FILE_PATH: process.env.NODE_ENV === 'development' 
      ? 'src/data/cards.json'
      : '/tmp/cards.json'
  }
}

export default nextConfig
