// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@pinia/nuxt", "nuxt-tiptap-editor"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  ui: {
    icons: ['heroicons', 'fa6-solid']
  },

  tiptap: {
    prefix: "Tiptap", //prefix for Tiptap imports, composables not included
  },

  compatibilityDate: "2024-07-11",
})