const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|gif|glb|gltf|bin)$/,
                loader: 'file-loader',
                options: {
                  name: '[path][name].[ext]',
                },
            }
        ]
  }
};