/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium']
  }
}

module.exports = nextConfig
