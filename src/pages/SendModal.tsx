import { Modal } from "antd";
import { useState } from "react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import loadingJson from "../images/loading.json";
import proofJson from "../images/proof.json";
import walletJson from "../images/wallet.json";
import completeJson from "../images/complete.json";
import explorerIcon from "../images/explorerIcon.png";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { getNetworkById } from "../constants/network";
import { closeModal, ModalName } from "../redux/modalSlice";

interface ISendModalProps {
  visible: boolean;
  onClose: () => void;
}

const SendModal = (data: ISendModalProps) => {
  const { visible } = data;
  const { transferInfo } = useAppSelector((state) => state);
  const { fromChain, toChain } = transferInfo;
  const [sendState, setSendState] = useState("submiting");
  const dispatch = useAppDispatch();
  console.log("visiblevisiblevisible", visible);
  const closeSendModal = () => {
    dispatch(closeModal(ModalName.sendModal));
  };

  let content = <div />;

  switch (sendState) {
    case "submiting":
      content = (
        <div>
          <div className="topImg">
            <Player
              autoplay
              loop
              src={loadingJson}
              style={{ height: "90px", width: "90px" }}
            >
              <Controls visible={false} />
            </Player>
          </div>
          <div className="stateText">
            Submitting your transaction on {fromChain?.name}...
          </div>
          <div
            className="viewInExplorer"
            onClick={() => {
              window.open(
                getNetworkById(fromChain?.chainId).blockExplorerUrl + "/tx/",
                "_blank"
              );
            }}
          >
            View in Explorer{" "}
            <span>
              <img src={explorerIcon} alt="" />
            </span>
          </div>
        </div>
      );
      break;
    case "waiting":
      content = (
        <div>
          <div className="topImg">
            <Player
              autoplay
              loop
              src={loadingJson}
              style={{ height: "90px", width: "90px" }}
            >
              <Controls visible={false} />
            </Player>
          </div>
          <div className="stateText">Waiting for X block confirmations...</div>
          <div
            className="viewInExplorer"
            onClick={() => {
              window.open(
                getNetworkById(fromChain?.chainId).blockExplorerUrl + "/tx/",
                "_blank"
              );
            }}
          >
            View in Explorer{" "}
            <span>
              <img src={explorerIcon} alt="" />
            </span>
          </div>
        </div>
      );
      break;
    case "generating":
      content = (
        <div>
          <div className="topImg">
            <Player
              autoplay
              loop
              src={proofJson}
              style={{ height: "90px", width: "90px" }}
            >
              <Controls visible={false} />
            </Player>
          </div>
          <div className="stateText" style={{ marginTop: 30 }}>
            Generating proof for your transfer…
          </div>
          <div className="stateText" style={{ marginTop: 0 }}>
            Please wait a few minutes.
          </div>
          <div
            className="viewInExplorer"
            onClick={() => {
              window.open(
                getNetworkById(fromChain?.chainId).blockExplorerUrl + "/tx/",
                "_blank"
              );
            }}
          >
            View in Explorer{" "}
            <span>
              <img src={explorerIcon} alt="" />
            </span>
          </div>
        </div>
      );
      break;
    case "releasing":
      content = (
        <div>
          <div className="topImg">
            <Player
              autoplay
              loop
              src={walletJson}
              style={{ height: "100px", width: "80px" }}
            >
              <Controls visible={false} />
            </Player>
          </div>
          <div className="stateText">
            Releasing your fund on {toChain?.name}...
          </div>
          <div className="stateText" style={{ marginTop: 0 }}>
            Please wait a few minutes.
          </div>
          <div
            className="viewInExplorer"
            onClick={() => {
              window.open(
                getNetworkById(fromChain?.chainId).blockExplorerUrl + "/tx/",
                "_blank"
              );
            }}
          >
            View in Explorer{" "}
            <span>
              <img src={explorerIcon} alt="" />
            </span>
          </div>
        </div>
      );
      break;
    case "complete":
      content = (
        <div>
          <div className="topImg">
            <Player
              autoplay
              loop
              src={completeJson}
              style={{ height: "100px", width: "80px" }}
            >
              <Controls visible={false} />
            </Player>
          </div>
          <div className="completedText">Transfer completed!</div>
          <div className="doneBtn">Done</div>
          <div className="bottomLink">
            <div />
            <div
              className="viewtx"
              onClick={() => {
                window.open(
                  getNetworkById(fromChain?.chainId).blockExplorerUrl + "/tx/",
                  "_blank"
                );
              }}
            >
              source chain tx{" "}
              <span>
                <img src={explorerIcon} alt="" />
              </span>
            </div>
            <div
              className="viewtx"
              onClick={() => {
                window.open(
                  getNetworkById(toChain?.chainId).blockExplorerUrl + "/tx/",
                  "_blank"
                );
              }}
            >
              dst chain tx{" "}
              <span>
                <img src={explorerIcon} alt="" />
              </span>
            </div>
            <div />
          </div>
        </div>
      );
      break;

    default:
      break;
  }
  return (
    <Modal
      visible={visible}
      onCancel={() => {}}
      title=""
      footer={null}
      width={512}
      className="sendModal"
      destroyOnClose
    >
      {content}
    </Modal>
  );
};
export default SendModal;
