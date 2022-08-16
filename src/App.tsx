import React from "react";
import "./app.css";
import "./app.less";
import bigImg from "@/assets/imgs/22.png";
import Class from "@/components/Class";
import { Demo1, Demo2 } from "@/components";

function App() {
  console.log("NODE_ENV", process, process.env.NODE_ENV, process.env.BASE_ENV);
  console.log(
    "NODE_ENV_URL",
    process.env.NODE_ENV_URL,
    process.env.REACT_APP_NFT_CONFIG_URL
  );
  return (
    <h2>
      webpack5-react-ts999
      <Class></Class>
      <img src={bigImg} alt="大于于10kb的图片" />
      <Demo1 />
    </h2>
  );
}
export default App;
