const path = require('path');

module.exports = {
    entry: './node_modules/@versatus/versatus-javascript/lib/wrapper.js', // Your main JS file
    output: {
        path: path.resolve(__dirname, '../../../../dist'),
        filename: 'bundle.js'
    },
    optimization: {
        usedExports: false,
    },
};
