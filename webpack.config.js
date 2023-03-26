const path = require('path');
module.exports = {
   entry: "./src/client/index.ts",
   output: {
       filename: "bundle.js",
       path: path.resolve(__dirname, 'dist')
   },
   resolve: {
       extensions: [".webpack.js", ".web.js", ".ts", ".js"]
   },
   module: {
       rules: [
        { test: /\.ts$/, loader: "ts-loader" },
        {
            test: /\.(mp3|wav)$/i,
            use: [
              {
                loader: 'file-loader',
              },
            ],
          },
    ]
   }
}