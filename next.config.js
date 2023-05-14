const dotenv = require("dotenv");

dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["static.itdg.com.br"],
  },
};

module.exports = nextConfig;
