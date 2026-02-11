const config = {
  projectName: 'easy-stay-mobile',
  date: '2026-02-11',
  designWidth: 750,
  deviceRatio: {
    375: 2,
    640: 2.34,
    750: 1,
    828: 1.81
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  framework: 'react',
  compiler: 'webpack5',
  plugins: ['@tarojs/plugin-framework-react', '@tarojs/plugin-platform-h5'],
  weapp: {},
  h5: {
    devServer: {
      host: '127.0.0.1',
      port: 10086
    },
    webpackChain (chain) {
      chain.merge({
        output: {
          environment: {
            asyncFunction: true
          }
        }
      })
    }
  }
}

module.exports = function () {
  return config
}
