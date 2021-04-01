import fs from 'fs'
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  server: {
    https: {
      key: fs.readFileSync('/etc/ssl/private/hypertubesigned.key'),
      cert: fs.readFileSync('/etc/ssl/certs/hyertubesigned.crt')
    }
  },
  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL,
    clientURL: process.env.CLIENT_URL
  },
  env:{
    apiUrl: process.env.BASE_URL,
    clientUrl: process.env.CLIENT_URL,
    id42:process.env.ID_42,
    idFacebook:process.env.ID_FACEBOOK
  },
  head: {
    title: 'Hypertube',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ],
    script: [
      {src: 'https://kit.fontawesome.com/58266b08e8.js', crossorigin: "anonymous"}
    ],
  },
  loading: false,
  serverMiddleware: [{handler:"redirect-ssl", redirectPort:443}],
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/main.css',
    '@/assets/css/main.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/snoast.js',
    '~/plugins/axios.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    '@nuxtjs/axios',
    ['nuxt-i18n',{
      defaultLocale: 'en',
      strategy: 'no_prefix',
      locales: [
        {code: "en",file: "en.js"},
        {code: "fr",file: "fr.js"}
      ],
      lazy: true,
      langDir: "locales"
    }]
  ],

  axios: {
    baseURL: process.env.BASE_URL,
    credentials: true
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
  watchers: {
    webpack: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
}
