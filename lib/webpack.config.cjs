const path = require('path');

// The entry path should be the 'wrapper.js' file in the 'dist' directory of the current project
const entryPath = path.join(process.cwd(), 'build', 'lib', 'wrapper');

// The output path should also be the 'dist' directory in the current project
const outputPath = path.join(process.cwd(), 'build');

module.exports = {
    entry: entryPath,
    output: {
        path: outputPath,
        filename: 'bundle.js'
    },
    mode: "production",
    optimization: {
        usedExports: false,
    },
};
