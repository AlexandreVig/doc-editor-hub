// https://nuxt.com/docs/api/configuration/nuxt-config

import createWebSocketServer from "./socket/server";

export default defineNuxtConfig({
  ssr: false,
  modules: ["@pinia/nuxt", "@nuxt/ui"],

  devtools: { enabled: true },

  runtimeConfig: {
    mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/doc-editor",
    public: {
      strapiUrl: process.env.STRAPI_URL,
    },
  },

  devServer: {
    port: 5000,
  },

  routeRules: {
    '/socket/**': { proxy: 'http://localhost:3000/**' },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  hooks: {
    // Hook into the server start to start Socket.IO server
    listen() {
      createWebSocketServer(3000);
    },
  },

  compatibilityDate: "2024-07-03",
});
