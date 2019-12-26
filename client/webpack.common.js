const path = require('path');

module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        filename: 'main.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(wav|png|svg|jpg|gif|glb|gltf|bin|mp3)$/,
                loader: 'file-loader',
                options: {
                  name: '[path][name].[ext]',
                },
            }
        ]
  }
};