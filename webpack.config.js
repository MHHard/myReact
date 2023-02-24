/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-var-requires */
const net = require("net");
const { merge } = require("webpack-merge");
const baseConfig = require("./build/webpack.base.js");
const prodConfig = require("./build/webpack.prod.js");
const devConfig = require("./build/webpack.dev.js");

const isDev = process.env.NODE_ENV === "development"; // 是否是开发模式
let PORT = 3000;
function checkPort(port) {
  PORT = port;
  const server = net.createServer().listen(port);
  server.on("listening", () => {
    server.close();
  });
  server.on("error", err => {
    if (err.code === "EADDRINUSE") {
      checkPort(port + 1);
    }
  });
}
checkPort(PORT);

module.exports = () => {
  const portConfig = {};
  return new Promise(resolve => {
    setTimeout(() => {
      if (isDev) {
        portConfig.devServer = {
          port: PORT,
        };
      }
      resolve(merge(baseConfig, isDev ? devConfig : prodConfig, portConfig));
    }, 100);
  });
};
