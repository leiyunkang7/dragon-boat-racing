// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxt/image', '@nuxt/scripts', '@nuxtjs/tailwindcss', '@nuxthub/core'],

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.bytedance.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap'
        }
      ]
    }
  },

  // 添加 host 配置，允许局域网访问
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  // Tailwind CSS 配置
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true,
  },

  // 静态资源配置
  nitro: {
    publicAssets: [
      {
        dir: 'public',
        baseURL: '/'
      }
    ]
  },

  // Vite 配置
  vite: {
    optimizeDeps: {
      include: ['phaser'],
      exclude: ['@nuxtjs/tailwindcss']
    },
    ssr: {
      noExternal: ['phaser']
    }
  }
})