let path = require("path");
let Webpack = require("webpack");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let VueLoaderPlugin = require("vue-loader/lib/plugin");
let { merge } = require("webpack-merge");
let { CleanWebpackPlugin } = require("clean-webpack-plugin");
let CopyWebpackPlugin = require("copy-webpack-plugin");
let MiniCssExtractPlugin = require("mini-css-extract-plugin");
let ProgressBarPlugin = require("progress-bar-webpack-plugin");
let Dotenv = require("dotenv-webpack");

/**
 * 配置文件
 */
let myConfig = require("./webpack.config.my.js");
let yipackConfig = require("../.yipack/yipack.config.js");
/**
 * loader配置文件
 */
let _loaderPostCssConfig = require("./loader/postcss-loader.config.js");
let _loaderBabelConfig = require("./loader/babel-loader.config.js");
let _loaderCssConfig = require("./loader/css-loader.config.js");
let _loaderSassConfig = require("./loader/sass-loader.config.js");
let _loaderStyleConfig = require("./loader/style-loader.config.js");
let _loaderSassResourcesConfig = require("./loader/sass-resources-loader.config.js");

/**
 * plugin 配置文件
 */
// let _pluginProvideConfig = require("./plugin/provide-plugin.config.js");

/**
 * 导出配置
 */
module.exports = merge(
    {
        mode: process.env.NODE_ENV,
        devtool: process.env.NODE_ENV === "development" ? "eval-source-map" : "hidden-source-map",
        entry: path.resolve(myConfig.srcDir, "main.js"),
        output: {
            path: myConfig.distDir,
            filename: "[name].js",
            publicPath: "./",
        },
        // stats: "errors-warnings",
        // stats: "none",
        cache: true,
        resolve: {
            alias: {
                "@src": myConfig.srcDir,
                "@static": path.resolve(myConfig.srcDir, "static"),
            },
            modules: [
                //
                path.resolve(myConfig.cliDir, "node_modules"),
                path.resolve(__dirname, "node_modules"),
                "node_modules",
            ],
        },
        resolveLoader: {
            modules: [
                //
                path.resolve(myConfig.cliDir, ".yipack"),
                path.resolve(myConfig.cliDir, "node_modules"),
                "node_modules",
            ],
        },
        // externals: {
        //     jquery: "$",
        // },
        // node: {
        //     fs: "empty",
        // },
        performance: {
            maxEntrypointSize: 1024 * 1024,
            maxAssetSize: 1024 * 1024,
        },
        optimization: {
            // 运行时
            // runtimeChunk: {
            //     name: "runtime",
            // },
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        //
                        _loaderStyleConfig,
                        _loaderCssConfig,
                        _loaderPostCssConfig,
                    ],
                    sideEffects: true,
                },
                {
                    test: /\.scss$/,
                    use: [
                        //
                        _loaderStyleConfig,
                        _loaderCssConfig,
                        _loaderPostCssConfig,
                        _loaderSassConfig,
                        _loaderSassResourcesConfig,
                    ],
                    sideEffects: true,
                },
                {
                    test: /\.js$/,
                    use: [_loaderBabelConfig],
                    exclude: /node_modules/,
                },
                {
                    test: /\.vue$/,
                    use: [
                        {
                            loader: "vue-loader",
                        },
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.(png|jpg|gif|jpeg|webp)$/,
                    use: {
                        loader: "url-loader",
                        options: {
                            limit: 1000,
                            name: "[hash:7].[ext]",
                            outputPath: "images",
                            esModule: false,
                        },
                    },
                    exclude: /node_modules/,
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                    use: {
                        loader: "url-loader",
                        options: {
                            limit: 1000,
                            name: "[hash:7].[ext]",
                            outputPath: "fonts",
                            esModule: false,
                        },
                    },
                    exclude: /node_modules/,
                },
                {
                    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
                    use: {
                        loader: "url-loader",
                        options: {
                            limit: 1000,
                            name: "[hash:7].[ext]",
                            outputPath: "videos",
                            esModule: false,
                        },
                    },
                    exclude: /node_modules/,
                },
                {
                    test: /\.(md)$/,
                    use: {
                        loader: "raw-loader",
                        options: {
                            esModule: false,
                        },
                    },
                    exclude: /node_modules/,
                },
            ],
        },
        plugins: [
            //
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(myConfig.srcDir, "static"),
                        to: path.resolve(myConfig.distDir, "static"),
                        cacheTransform: true,
                    },
                ],
            }),
            new MiniCssExtractPlugin({
                filename: "[name].css",
            }),
            new Dotenv({
                path: path.resolve(myConfig.srcDir, "env", process.env.NODE_ENV + ".env"),
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(myConfig.srcDir, "tpls", "index.html"),
            }),
            new VueLoaderPlugin(),
            new ProgressBarPlugin({}),
            new Webpack.ProvidePlugin(yipackConfig.providePlugin),
        ],
    },
    yipackConfig.webpack.common
);
