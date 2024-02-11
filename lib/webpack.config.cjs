const path = require('path');
const fs = require('fs');

const isInstalledPackage = fs.existsSync(
    path.resolve(process.cwd(), 'node_modules', '@versatus', 'versatus-javascript')
);

const outputPath = path.join(process.cwd(), 'build');

module.exports = {
    entry: path.resolve(process.cwd(), "./build/lib/wasm-wrapper.js"),
    context: path.resolve(process.cwd()),
    output: {
        path: outputPath,
        filename: 'bundle.js',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    targets: {
                                        esmodules: true // For browsers that support ES Modules
                                    },
                                    useBuiltIns: 'usage', // Polyfills the features needed for the target environments, automatically.
                                    corejs: { version: 3, proposals: true } // Specify the core-js version
                                }],
                                '@babel/preset-typescript', // For TypeScript support
                            ],
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    esmodules: true // Same as above for .js files
                                },
                                useBuiltIns: 'usage',
                                corejs: { version: 3, proposals: true }
                            }],
                        ],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx'],
        mainFields: ['browser', 'module', 'main'],
        alias: {
            '@versatus/versatus-javascript': './build/lib/index.js',
        },
    },
    mode: 'production',
    devtool: 'source-map', // Include source maps in production files
};
