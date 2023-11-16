const path = require('path');
const entryPath = require.resolve('@versatus/versatus-javascript/lib/wrapper');

module.exports = {
    entry: entryPath, // Your main JS file
    output: {
        path: path.resolve(__dirname, '../../../../dist'),
        filename: 'bundle.js'
    },
    mode: "production",
    optimization: {
        usedExports: false,
    },
};
