import type { NextConfig } from 'next';
import * as path from 'path';

const nextConfig: NextConfig = {
  // Define explicit tracing root so Next.js doesn't infer workspace root
  outputFileTracingRoot: path.join(__dirname),
  images: {
    // Allow listed remote hosts for `next/image` — keep both domains and patterns
    domains: [
      'aquaequipos.com',
      'mediumorchid-giraffe-178141.hostingersite.com',
      'i0.wp.com',
      'www.emeraldpoolandspa.com',
      'upload.wikimedia.org',
      'franklin-electric.com',
      'www.hydrosourcetx.com',
      'lh3.googleusercontent.com',
      'fele.widen.net',
      'images.unsplash.com',
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'aquaequipos.com' },
      { protocol: 'https', hostname: 'mediumorchid-giraffe-178141.hostingersite.com' },
      { protocol: 'https', hostname: 'i0.wp.com' },
      { protocol: 'https', hostname: 'www.emeraldpoolandspa.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'franklin-electric.com' },
      { protocol: 'https', hostname: 'www.hydrosourcetx.com' },
      { protocol: 'https', hostname: 'fele.widen.net' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
