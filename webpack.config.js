// webpack.config.js

module.exports = {
  // other configuration options...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /bootstrap/,
      },
    ],
  },
};
