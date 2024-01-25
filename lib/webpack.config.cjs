const path = require('path');
const webpack = require('webpack');
const fs = require('fs')

const isInstalledPackage = fs.existsSync(path.resolve(process.cwd(), 'node_modules', '@versatus', 'versatus-javascript'));
console.log({isInstalledPackage})


const wrapperDir = isInstalledPackage
? path.resolve(process.cwd(), 'node_modules', '@versatus', 'versatus-javascript', 'dist', 'lib', 'wrapper.js')
: path.resolve(process.cwd(), 'dist', 'lib', 'wrapper.js');
// The entry path should be the 'wrapper.js' file in the 'dist' directory of the current project
// The output path should also be the 'dist' directory in the current project
const outputPath = path.join(process.cwd(), 'build');

console.log({wrapperDir, outputPath})

module.exports = {
    entry: wrapperDir,
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
