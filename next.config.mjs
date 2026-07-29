/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // next-mdx-remote/rsc compiles MDX on the server at request/build time.
  },
};

export default nextConfig;
