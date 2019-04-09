const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      $ENV: {
        ENVIRONMENT: JSON.stringify(process.env.ENVIRONMENT),
        ServerURL: JSON.stringify(process.env.ServerURL),
        City: JSON.stringify(process.env.City),
      }
    })
  ]
};
