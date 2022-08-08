const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/',
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': '/src',
        store: '/src/store'
      }
    },
    plugins: [
      // 需要把 autoimport 添加进去，否则打包会报错
      require('unplugin-auto-import/webpack')({
        imports: ['vue', 'vue-router'],
        dts: false
      })
    ]
  }
})
