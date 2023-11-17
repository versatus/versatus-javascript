const path = require('path');

let entryPath, outputPath;
try {
    // Resolving the entry path
    entryPath = require.resolve('@versatus/versatus-javascript/lib/wrapper');
    // Assume this is in a project, set the output path accordingly
    outputPath = path.resolve(__dirname, '../../../../dist'); // Adjust as needed
} catch (e) {
    // Fallback for local development
    entryPath = path.resolve(__dirname, 'wrapper');
    outputPath = path.resolve(__dirname, '../dist'); // Local development output path
}

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
