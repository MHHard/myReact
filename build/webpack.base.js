const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer"); // 引入分析打包结果插件
const WeedsWebpackPlugin = require("weeds-webpack-plugin");

const isDev = process.env.NODE_ENV === "development"; // 是否是开发模式
// console.log(8888, process.env.NODE_ENV);

module.exports = {

  entry: path.join(__dirname, "../src/index.tsx"), // 入口文件
  // 打包文件出口
  output: {
    filename: "index.js", // 每个输出js的名称
    path: path.join(__dirname, "../dist"), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: "/", // 打包后文件的公共前缀路径
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: "maintest", 
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          "thread-loader",
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              happyPackMode: true,
            },
          },
        ],
        include: [path.resolve(__dirname, "../src")],
        exclude: /node_modules/,
      },
      {
        include: [path.resolve(__dirname, "../src")], //只对项目src文件的ts,tsx进行loader解析
        test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
        use: ["thread-loader", "babel-loader"],
        // {
        //   loader: "babel-loader",
        //   options: {
        //     // 预设执行顺序由右往左,所以先处理ts,再处理jsx
        //     presets: [
        //       [
        //         "@babel/preset-react",
        //         {
        //           // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
        //           // "targets": {
        //           //  "chrome": 35,
        //           //  "ie": 9
        //           // },
        //           useBuiltIns: "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
        //           corejs: 3, // 配置使用core-js低版本
        //         },
        //       ],
        //       "@babel/preset-react",
        //       "@babel/preset-typescript",
        //     ],
        //   },
        // },
      },
      {
        test: /.css$/, //匹配所有的 css 文件
        // include: [path.resolve(__dirname, "../src")],
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /.less$/, //匹配所有的 less 文件
        include: [path.resolve(__dirname, "../src")],
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
          "css-loader",
          "postcss-loader",
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                exclude: /node_modules/,
                // modifyVars: theme, // 自定义主题的
                javascriptEnabled: true
              }
            }
          }
        ],
        
      },

      {
        test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "static/images/[name].[contenthash:8][ext]", // 文件输出目录和命名
        },
      },
      {
        test: /\.m?js$/,
        resolve: {
           fullySpecified: false
        },
      }
    ],
  },
  resolve: {
    alias: {
      "@": path.join(__dirname, "../src"),
    },
    extensions: [".js", ".tsx", ".ts"],
    // modules: [path.resolve(__dirname, "../node_modules")], // 查找第三方模块只在本项目的node_modules中查找
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      url: require.resolve('url'),
      buffer: require.resolve('buffer/'),
      util: require.resolve('util/'),
      stream: require.resolve('stream-browserify/'),
      vm: require.resolve('vm-browserify'),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser") ,
      fs:false 
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"), // 模板取定义root节点的模板
      inject: true, // 自动注入静态资源
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ['buffer', 'Buffer'],
      React: "react",
    }),
    // new BundleAnalyzerPlugin(), // 配置分析打包结果插件
    new WeedsWebpackPlugin({
      writeType: "json", // default cli log, value: json or ''
    }),

  ],
  cache: {
    type: "filesystem", // 使用文件缓存
    allowCollectingMemory: true,
  },
};
