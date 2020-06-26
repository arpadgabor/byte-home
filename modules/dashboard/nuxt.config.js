require('dotenv').config()
export default {
  mode: 'universal',
  head: {
    title: 'Dashboard',
    titleTemplate: '%s | ByteHome',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'prefetch', as: 'font', href: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;700;800&display=swap'}
    ]
  },
  css: ['@/assets/css/tailwind.css'],
  plugins: [
    '@/plugins/http.server',
    '@/plugins/charts.client',
    { src: '@/plugins/socket.client', ssr: false }
  ],
  middleware: ['authenticated'],
  buildModules: ['@nuxtjs/tailwindcss',],
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
    '@nuxt/http',
  ],

  http: {
    proxy: true,
    prefix: '/api'
  },
  proxy: {
    '/api/': {
      target: process.env.API_URL,
      pathRewrite: { '^/api/': '' }
    },
    '/uploads/': {
      target: process.env.API_URL,
      // pathRewrite: { '^/uploads/': '' }
    },
    '/socket.io/': {
      target: process.env.API_URL,
      ws: true,
    },
  },
  build: {
    vendor : [
      'vue-apexchart'
    ],
    extend (config, ctx) {
    }
  }
}
