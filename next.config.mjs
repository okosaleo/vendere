
/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [ 
            {
                hostname: "utfs.io",
                protocol: "https",
                port: "",
            }
        ]
    }
};

export default nextConfig;
