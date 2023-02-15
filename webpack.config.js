/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require("webpack-merge");
const baseConfig = require("./build/webpack.base.js");
const prodConfig = require("./build/webpack.prod.js");
const devConfig = require("./build/webpack.dev.js");

const isDev = process.env.NODE_ENV === "development"; // 是否是开发模式

module.exports = merge(baseConfig, isDev ? devConfig : prodConfig);
