const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
        new ESLintPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "public", "index.html")
        }),
        new Dotenv({ path: "./env", safe: true })
    ],
    devServer: {
        static: path.join(__dirname, "public"),
        compress: true,
        port: 3000
    },
    entry: path.resolve(__dirname, "src", "index.tsx"),
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].bundle.js",
        chunkFilename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{ loader: "babel-loader" }]
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [{ loader: "ts-loader" }]
            },
            {
                test: /\.css$/,
                use: [{ loader: "style-loader" }, { loader: "css-loader" }]
            },
            {
                test: /\.(png|svg|jpg|gif)$/i,
                use: ["file-loader"]
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    }
};
