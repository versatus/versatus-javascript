const path = require('path');

module.exports = {
    entry: './lib/wrapper.js', // Your main JS file
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'bundle.js'
    },
    optimization: {
        usedExports: false,
    },
};
