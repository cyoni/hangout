/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PICTURES_SERVICE_ENDPOINT: process.env.PICTURES_SERVICE_ENDPOINT,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "upload.wikimedia.org",
      "www.innovaxn.eu",
      "encrypted-tbn0.gstatic.com",
    ],
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
    }

    return config
  },
}

module.exports = nextConfig
