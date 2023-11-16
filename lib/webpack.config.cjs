const path = require('path');
// const entryPath = require.resolve('@versatus/versatus-javascript/lib/wrapper');

module.exports = {
    entry: './node_modules/@versatus/versatus-javascript/lib/wrapper.js', // Your main JS file
    output: {
        path: path.resolve(__dirname, '../../../../dist'),
        filename: 'bundle.js'
    },
    mode: "production",
    optimization: {
        usedExports: false,
    },
};
