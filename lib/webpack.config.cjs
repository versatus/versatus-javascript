const path = require('path');

let entryPath;
try {
    entryPath = require.resolve('@versatus/versatus-javascript/lib/wrapper');
} catch (e) {
    entryPath = path.resolve(__dirname, 'wrapper');
}

module.exports = {
    entry: entryPath,
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'bundle.js'
    },
    mode: "production",
    optimization: {
        usedExports: false,
    },
};
