const path = require('path');
const webpack = require('webpack');

// The entry path should be the 'wrapper.js' file in the 'dist' directory of the current project
const entryPath = path.join(process.cwd(), 'dist', 'lib', 'wrapper.js');

// The output path should also be the 'dist' directory in the current project
const outputPath = path.join(process.cwd(), 'build');

module.exports = {
    entry: entryPath,
    output: {
        path: outputPath,
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx'], // Add '.ts' and '.tsx' if you're directly importing TypeScript files somewhere
        mainFields: ['browser', 'module', 'main'],

      },
    mode: "production",
    optimization: {
        usedExports: false,
    },
};
