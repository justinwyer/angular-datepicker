module.exports = {
    entry: "./datepicker.js",
    output: {
        path: __dirname + '/dist/',
        filename: "datepicker.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.html$/, loader: "html" }
        ]
    }
};