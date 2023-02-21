import showTitle from "../images/showTitle.png";

interface ILatestBlockInfoProps {
  visible: boolean;
}
const LatestBlockInfo = (data) => {
  return (
    <div className="latestBody">
      <div className="latestBlock">
        <div className="chartTitle">
          <img src={showTitle} alt="" className="showTitle" />
          <div>Proof Generation Time</div>
        </div>
        <div className="blockContent">
          <div className="blockItem">
            <div className="blockItemKey">Block number:</div>
            <div className="blockItemVal">12322212</div>
          </div>
          <div className="blockItem">
            <div className="blockItemKey">Block hash:</div>
            <div className="blockItemVal">
              5yjXGAg3CeBCnGpKnbyiwSzyhpY4wtYEo76Wm2fBHNdj
            </div>
          </div>
          <div className="blockItem">
            <div className="blockItemKey">Block state root:</div>
            <div className="blockItemVal">
              <div className="blockRootAuto">
                0x00000000000000201c6e854e9b4902d63290f276bbdaaaf33fbf63953f183245e1ec21b43ac76f2400000000000000205
              </div>
            </div>
          </div>
          <div className="blockItem">
            <div className="blockItemKey">Timestamp:</div>
            <div className="blockItemVal">2023-02-04 16:34:34 </div>
          </div>
        </div>
      </div>
      <div className="latestProof">
        <div className="chartTitle">
          <img src={showTitle} alt="" className="showTitle" />
          <div>Proof Generation Time</div>
        </div>
        <div className="proofContent">
          <div className="blockItem">
            <div className="blockItemKey">Proof Data:</div>
            <div className="blockItemVal">
              <div className="dataOut">
                0x00000000000000201c6e854e9b4902d63290f276bbdaaaf33fbf63953f183245e1ec21b43ac76f240000000000000020576bbdaaaf33fbf63953f183245e1ec21b43ac76f240000000000000020576bbdaaaf33fbf63953f183245e1ec21b43ac76f240000000000000020576bbdaaaf33fbf63953f183245e1ec21b43ac76f240000000000000020576bbdaaaf33fbf63953f183245e1ec21b43ac76f2400000000000000205
              </div>
            </div>
          </div>
          <div className="blockItem">
            <div className="blockItemKey">Timestamp:</div>
            <div className="blockItemVal">2023-02-04 16:34:34 </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestBlockInfo;
