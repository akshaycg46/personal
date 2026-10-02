import type { NextConfig } from 'next';
const config: NextConfig = { output: 'export', basePath: '/personal', images: { unoptimized: true }, trailingSlash: true };
export default config;
