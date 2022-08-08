module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // 添加 可选链操作符(?.)和空值合并运算符(??) 插件，使webpack打包生效
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator'
  ]
}
