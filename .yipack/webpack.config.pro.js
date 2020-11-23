let path = require("path");
let { merge } = require("webpack-merge");
let configCommon = require("./webpack.config.common.js");
let myConfig = require("./webpack.config.my.js");
let yipackConfig = require("../.yipack/yipack.config.js");
let config = merge(
    configCommon,
    {
        // optimization: {
        //     minimize: false,
        //     occurrenceOrder: false,
        //     providedExports: false,
        //     concatenateModules: false,
        //     sideEffects: false,
        //     usedExports: false,
        //     namedModules: true,
        //     namedChunks: true,
        // },
        // watchOptions: {
        //     poll: 1000,
        //     aggregateTimeout: 600,
        //     ignored: /node_modules|\.cache/,
        // },
        plugins: [
            //
        ],
    },
    yipackConfig.webpack.pro
);
module.exports = config;
