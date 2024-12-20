import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
		remotePatterns: [
		  {
		    hostname: 'avatar.vercel.sh',
		  },
		  {
			  hostname: 'avatars.githubusercontent.com',
		  }
		],
	},
  async rewrites() {
    return [
      {
        source: '/api/py/:path*',
        destination: 
          isDev
            ? "http://127.0.0.1:8000/api/py/:path*"
            : 'https://api.nahida-aa.us.kg/api/py/:path*', // 代理到外部 API
      },
    ];
  },
  // redirects: async () => [
  //   {
  //     source: '/',
  //     destination: '/openapi',
  //     permanent: true,
  //   },
  // ],
  // output: 'standalone',
};

export default nextConfig;
