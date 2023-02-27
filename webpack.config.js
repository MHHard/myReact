/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-var-requires */
const net = require("net");
const { merge } = require("webpack-merge");
// const readline = require("readline");
const baseConfig = require("./build/webpack.base.js");
const prodConfig = require("./build/webpack.prod.js");
const devConfig = require("./build/webpack.dev.js");

const isDev = process.env.NODE_ENV === "development";
let PORT = 3000;
// let portIsUsed = false;
function checkPort(port) {
  PORT = port;
  const server = net.createServer().listen(port);
  server.on("listening", () => {
    server.close();
  });
  server.on("error", err => {
    if (err.code === "EADDRINUSE") {
      // portIsUsed = true;
      checkPort(port + 1);
    }
  });
}
checkPort(PORT);

// function askUser(resolve, portConfig) {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question(
//     " Something is already running on port 3000. Would you like to run the app on another port instead? (yes/no) ",
//     answer => {
//       if (answer.toLowerCase() === "yes" || answer.toLowerCase() === "y") {
//         return resolve(merge(baseConfig, isDev ? devConfig : prodConfig, portConfig));
//       }
//       if (answer.toLowerCase() === "no" || answer.toLowerCase() === "n") {
//         return process.exit();
//       }
//       console.log("Invalid answer. Please enter yes or no!");
//       rl.close();
//       return process.exit();
//     },
//   );
// }

module.exports = () => {
  const portConfig = {};
  return new Promise(resolve => {
    setTimeout(() => {
      if (isDev) {
        portConfig.devServer = {
          port: PORT,
        };
      }
      return resolve(merge(baseConfig, isDev ? devConfig : prodConfig, portConfig));
    }, 100);
  });
};
