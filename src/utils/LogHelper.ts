// source-map-support,babel-plugin-source-map-support

/* eslint-disable*/
/* eslint-disable camelcase */
import "source-map-support/register";
import path from "path-browserify";
import moment from "dayjs";
export class LogHelper {
  static Init() {
    const log = console.log;
    console.log = function (message: any, ...args: any[]) {
      const stackInfoStr = LogHelper.stackInfo();
      const info = `%c[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}][log][${stackInfoStr.file}:${stackInfoStr.line} (${
        stackInfoStr.method
      })] %c`;
      log(info, "color: #48d1cc", "color: white", message, ...args);
    };

    console.debug = function (message: any, ...args: any[]) {
      if (process.env.REACT_APP_ENV_TYPE === "aptos") {
        return;
      }
      if (process.env.REACT_APP_ENV === "MAINNET" && process.env.NODE_ENV === "production") {
        return;
      }
      const stackInfoStr = LogHelper.stackInfo();
      const info = `%c[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}][debug][${stackInfoStr.file}:${
        stackInfoStr.line
      } (${stackInfoStr.method})] %c`;
      log(info, "color: #48d1cc", "color: white", message, ...args);
    };

    const loginfo = console.info;
    console.info = function (message: any, ...args: any[]) {
      if (process.env.REACT_APP_ENV_TYPE === "aptos") {
        return;
      }
      if (process.env.REACT_APP_ENV === "MAINNET" && process.env.NODE_ENV === "production") {
        return;
      }
      const stackInfoStr = LogHelper.stackInfo();
      const info = `%c[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}][info][${stackInfoStr.file}:${
        stackInfoStr.line
      } (${stackInfoStr.method})] %c`;
      loginfo(info, "color: #3ebe3e", "color: white", message, ...args);
    };

    const warn = console.warn;
    console.warn = function (message: any, ...args: any[]) {
      const stackInfoStr = LogHelper.stackInfo();
      const info = `%c[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}][warn][${stackInfoStr.file}:${
        stackInfoStr.line
      } (${stackInfoStr.method})] %c`;
      warn(info, "color: #dbd172", "color: #dbd172", message, ...args);
    };

    const error = console.error;
    console.error = function (message: any, ...args: any[]) {
      const stackInfoStr = LogHelper.stackInfo();
      const info = `[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}][error][${stackInfoStr.file}:${stackInfoStr.line} (${
        stackInfoStr.method
      })] `;
      error(info, message, ...args);
    };
  }

  static stackInfo(num = 0) {
    const data: any = {};
    const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
    const stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;
    const errorObj = new Error();
    if (errorObj) {
      const stacklist = errorObj.stack?.split("\n").slice(3);

      if (stacklist) {
        const s = stacklist[num];
        const sp = stackReg.exec(s) || stackReg2.exec(s);
        if (sp && sp.length === 5) {
          data.method = sp[1];
          data.path = sp[2];
          data.line = sp[3];
          data.pos = sp[4];
          data.file = path.basename(data.path);
        }
      }
    }

    return data;
  }
}
