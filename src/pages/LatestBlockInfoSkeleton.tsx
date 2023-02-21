import { Skeleton } from "antd";
import showTitle from "../images/showTitle.png";

const LatestBlockInfoSkeleton = () => {
  return (
    <div className="latestBody">
      <div className="latestBlock">
        <div className="chartTitle">
          <img src={showTitle} alt="" className="showTitle" />
          <div>Proof Generation Time</div>
        </div>
        <div className="blockContent">
          <div className="blockItem" style={{ marginBottom: 3 }}>
            <Skeleton.Input active style={{ height: 16 }} />
          </div>
          <div className="blockItem" style={{ marginBottom: 8 }}>
            <Skeleton.Input active style={{ height: 24 }} />
          </div>
          <div className="blockItem" style={{ marginBottom: 8 }}>
            <Skeleton.Input active style={{ height: 80 }} />
          </div>
          <div className="blockItem">
            <Skeleton.Input active style={{ height: 16 }} />
          </div>
        </div>
      </div>
      <div className="latestProof">
        <div className="chartTitle">
          <img src={showTitle} alt="" className="showTitle" />
          <div>Proof Generation Time</div>
        </div>
        <div className="proofContent">
          <div className="blockItem" style={{ marginBottom: 8 }}>
            <Skeleton.Input active style={{ height: 136 }} />
          </div>
          <div className="blockItem">
            <Skeleton.Input active style={{ height: 16 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestBlockInfoSkeleton;
