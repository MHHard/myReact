import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import logoIcon from "../images/logo.png";
import freshIcon from "../images/freshIcon.png";
import showTitle from "../images/showTitle.png";
import Tab from "../components/Tab";
import Chart from "../components/Chart";
import LatestBlockInfo from "./LatestBlockInfo";
import LatestBlockInfoSkeleton from "./LatestBlockInfoSkeleton";

const BridgeInfo = (data) => {
  const dispatch = useAppDispatch();
  const { transferInfo } = useAppSelector((state) => state);
  const [tabKey, setTabKey] = useState("goerli");
  const history = useHistory();
  const onHomeClick = () => {
    history.push("/bridge");
  };

  const refreshData = () => {
    getData();
  };

  const getData = () => {};

  useEffect(() => {
    getData();
  }, []);

  const tabChanged = (val) => {
    setTabKey(val);
  };

  return (
    <div className="bridgeInfo">
      <div className="bridgeInfoHeadLeft">
        <div
          onClick={() => {
            onHomeClick();
          }}
        >
          <img src={logoIcon} height="37px" alt="bridge" />
        </div>
      </div>
      <div className="bridgeInfoContent">
        <div className="conTop">
          <Tab
            selectedKey={tabKey}
            onSelect={(value) => {
              tabChanged(value);
            }}
            keyList={["goerli", "BSC Testnet"]}
          />
          <span
            onClick={() => {
              refreshData();
            }}
          >
            <img src={freshIcon} alt="" className="freshIcon" />
          </span>
        </div>
        <div className="chartAre">
          <div className="chartTitle">
            <img src={showTitle} alt="" className="showTitle" />
            <div>Proof Generation Time</div>
          </div>
          <div className="chartBody">
            <Chart chartData="" />
          </div>
        </div>
        <LatestBlockInfo data="" />
        {/* <LatestBlockInfoSkeleton /> */}
      </div>
    </div>
  );
};

export default BridgeInfo;
