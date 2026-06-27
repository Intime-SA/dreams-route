/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This project lives in a subfolder of another repo; don't inherit its lint config.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
