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
      authApiUrl: process.env.NUXT_PUBLIC_AUTH_API_URL ?? 'http://localhost:3001',
    },
  },
  app: {
    head: {
      title: 'Aresta Canvas — Quadro Infinito e Notas',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Quadro visual infinito estilo Obsidian Canvas com escrita manual e IA.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
    },
  },
})
