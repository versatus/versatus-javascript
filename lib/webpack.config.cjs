const path = require('path');

// Resolving the entry path
let entryPath;
try {
    entryPath = require.resolve('@versatus/versatus-javascript/lib/wrapper');
} catch (e) {
    // Fallback for local development
    entryPath = path.resolve(__dirname, 'wrapper');
}

// The output path should be the 'dist' directory in the current project
const outputPath = path.join(process.cwd(), 'dist');

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
