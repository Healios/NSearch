module.exports = {
  chainWebpack: config => {
    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type("javascript/auto")
      .use("i18n")
      .loader("@kazupon/vue-i18n-loader")
      .end();
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "NSearch",
        win: {
          target: ["nsis", "portable"],
          // icon: __dirname + "/src/Assets/icon.ico"
        }
      }
    }
  },
}
