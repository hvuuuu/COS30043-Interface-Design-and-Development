const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.football-data.org/v4',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        onProxyReq: (proxyReq, req, res) => {
          proxyReq.setHeader('X-Auth-Token', '686e01d4cc1c48b5a67fd06f3c6700a3');
        }
      }
    }
  }
});