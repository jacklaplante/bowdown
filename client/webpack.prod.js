const merge = require('webpack-merge');
const common = require('./webpack.common.js');
var JavaScriptObfuscator = require('webpack-obfuscator');
module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new JavaScriptObfuscator ({
      rotateStringArray: true,
      compact: true,
      selfDefending: true,
      disableConsoleOutput: true,
      debugProtection: true
    })
  ],
});