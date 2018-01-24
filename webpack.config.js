const	path	=	require("path");
module.exports = {
  entry: ['whatwg-fetch',	'./js/app.jsx'],
  output: {
    path: path.resolve("dist"),
    filename:	"./js/out.js"
  },
  watch: true,
  module: {
    loaders: [{
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015','stage-2','react']
        }
      }
    ]
  }
}
