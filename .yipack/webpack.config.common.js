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
let ESLintPlugin = require("eslint-webpack-plugin");

/**
 * 配置文件
 */
let myConfig = require("./webpack.config.my.js");
let yipackConfig = require("./yipack.config.js");
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
let commonConfig = {
    mode: process.env.NODE_MODE,
    name: "yipack-webpack-config",
    profile: true,
    recordsPath: path.resolve(myConfig.cacheDir, "records.json"),
    // 入口
    entry: path.resolve(myConfig.srcDir, "main.js"),
    // 基础目录，绝对路径，用于从配置中解析入口点(entry point)和 加载器(loader)。
    context: myConfig.rootDir,
    // 出口
    output: {
        path: myConfig.distDir,
        filename: "js/[name].[fullhash:7].js",
        publicPath: "./",
    },
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

    infrastructureLogging: {
        // level: "info",
        level: "verbose",
    },
    // stats: "errors-warnings",
    stats: {
        assets: false,
        assetsSort: "!size",
        builtAt: false,
        moduleAssets: false,
        cached: false,
        assetsSpace: 1,
        modulesSpace: 1,
        cachedModules: false,
        runtimeModules: false,
        dependentModules: false,
        groupAssetsByChunk: false,
        groupAssetsByEmitStatus: false,
        groupAssetsByInfo: false,
        groupModulesByAttributes: false,
        cachedAssets: false,
        children: false,
        chunks: false,
        chunkGroups: false,
        chunkModules: false,
        chunkOrigins: false,
        chunksSort: "name",
        colors: false,
        depth: false,
        entrypoints: false,
        env: false,
        orphanModules: false,
        errors: false,
        errorDetails: false,
        errorStack: false,
        hash: false,
        logging: "verbose",
        loggingTrace: false,
        modules: false,
        modulesSort: "!size",
        moduleTrace: false,
        outputPath: false,
        performance: false,
        providedExports: false,
        errorsCount: false,
        warningsCount: false,
        publicPath: false,
        reasons: false,
        relatedAssets: false,
        source: false,
        timings: false,
        usedExports: false,
        version: false,
        chunkGroupAuxiliary: false,
        chunkGroupChildren: false,
        chunkGroupMaxAssets: 1,
        warnings: false,
    },
    externals: yipackConfig.externals,
    node: {
        global: false,
        __filename: true,
        __dirname: true,
    },
    performance: {
        hints: "warning",
        maxEntrypointSize: 1024 * 1024 * 20,
        maxAssetSize: 1024 * 1024 * 30,
    },
    optimization: {
        // 运行时
        // runtimeChunk: {
        //     name: "runtime",
        // },
    },
    module: {
        unsafeCache: process.env.NODE_MODE === "production" ? false : true,
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
            },
            {
                test: /\.(png|jpg|gif|jpeg|webp)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 1000,
                        name: "[hash:7].[ext]",
                        outputPath: "assets/images",
                        esModule: false,
                    },
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 1000,
                        name: "[hash:7].[ext]",
                        outputPath: "assets/fonts",
                        esModule: false,
                    },
                },
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 1000,
                        name: "[hash:7].[ext]",
                        outputPath: "assets/videos",
                        esModule: false,
                    },
                },
            },
            {
                test: /\.(md)$/,
                use: {
                    loader: "raw-loader",
                    options: {
                        esModule: false,
                    },
                },
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
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].[fullhash:7].css",
        }),
        new HtmlWebpackPlugin({
            minify: false,
            template: path.resolve(myConfig.srcDir, "tpls", "index.html"),
        }),
        new VueLoaderPlugin(),
        new ProgressBarPlugin({}),
        new Webpack.ProvidePlugin(yipackConfig.providePlugin),
        new ESLintPlugin(yipackConfig.eslint),
    ],
};
if (process.env.NODE_ENV) {
    commonConfig.plugins.push(
        new Dotenv({
            path: path.resolve(myConfig.srcDir, "env", process.env.NODE_ENV + ".env"),
            safe: true,
            allowEmptyValues: true,
            systemvars: true,
            silent: false,
            defaults: false,
        })
    );
} else {
    commonConfig.plugins.push(
        new Dotenv({
            path: path.resolve(myConfig.srcDir, "env", process.env.NODE_MODE + ".env"),
        })
    );
}
module.exports = commonConfig;
