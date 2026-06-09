/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Old "undercut" funnel was renamed to "quote-review". Keep the old URLs
      // (still live in Facebook ads) working with a permanent redirect.
      {
        source: '/renovision/undercut',
        destination: '/renovision/quote-review',
        permanent: true,
      },
      {
        source: '/renovision/undercut/:path*',
        destination: '/renovision/quote-review/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig;
