import type { NextConfig } from 'next'

// Trang tĩnh thuần (ADR-0001): `next build` sinh thẳng ra `out/`, không cần runtime.
// Không đọc biến môi trường nào — xem `.env.example`.
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
}

export default nextConfig
