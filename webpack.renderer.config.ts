import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import webpackNodeExternals from 'webpack-node-externals';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'postcss-loader' }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  externals: [
    webpackNodeExternals({
      allowlist: [/webpack(\/.*)?/, /@jitt(\/.*)?/, 'electron-devtools-installer']
    })
  ],
  resolve: {
    fallback: {
      path: require.resolve('path-browserify')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
