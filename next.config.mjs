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
      // Denver basement funnel was moved from /peakbuilders-denver to
      // /denver_basements. Keep the old URL (and any live ad links) working.
      {
        source: '/peakbuilders-denver',
        destination: '/denver_basements',
        permanent: true,
      },
      {
        source: '/peakbuilders-denver/:path*',
        destination: '/denver_basements/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig;
