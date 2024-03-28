import path from 'path'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
    modules: ['node_modules', path.resolve(__dirname, 'node_modules')],
  },
  resolveLoader: {
    modules: [
      'node_modules', // to look in the local node_modules
      path.resolve(__dirname, 'node_modules'), // to look in your library's node_modules
    ],
  },
  mode: 'production',
  externalsPresets: { node: true },
  optimization: {
    minimize: false, // Depending on your preference for the output
  },
}
