export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  ssr: false, // SPA mode for Tauri compatibility
  runtimeConfig: {
    public: {
      canvasApiUrl: process.env.NUXT_PUBLIC_CANVAS_API_URL ?? 'http://localhost:3004',
      memoryApiUrl: process.env.NUXT_PUBLIC_MEMORY_API_URL ?? 'http://localhost:3005',
      aiApiUrl: process.env.NUXT_PUBLIC_AI_API_URL ?? 'http://localhost:3002',
    },
  },
})
