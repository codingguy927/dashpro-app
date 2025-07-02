/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    // …other packages…
    'lucide-react',        // we still transpile it
  ],
  serverExternalPackages: [
    // …other packages…
    // (no 'lucide-react' here)
  ],
}

module.exports = nextConfig
