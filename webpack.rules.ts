import type { ModuleOptions } from 'webpack';

export const rules: Required<ModuleOptions>['rules'] = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader',
  },
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  { test: /\.svg$/, use: ['@svgr/webpack'] },
  {
    test: /\.(png|jpe?g|gif|webp)$/,
    type: 'asset/resource',
    generator: {
      filename: 'images/[hash][ext][query]'
    }
  },
  {
    test: /\.(woff2?|otf|ttf)$/,
    type: 'asset/resource',
    generator: {
      filename: 'fonts/[hash][ext][query]'
    }
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
      },
    },
  },
];
