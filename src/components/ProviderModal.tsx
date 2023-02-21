import { Button, Checkbox, Modal, Spin } from "antd";
import { injected } from "@celer-network/web3modal";
import { RightOutlined } from "@ant-design/icons";
import { useContext, useState } from "react";
import { createUseStyles } from "react-jss";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { ColorThemeContext } from "../providers/ThemeProvider";

interface ProviderModalProps {
  visible: boolean;
  onCancel: () => void;
}
interface WalletConnectProviderModalProps {
  visible: boolean;
  onCancel: () => void;
  onSelectWalletConnect: () => void;
}
function Provider({ provider, onClick }) {
  return (
    <>
      {provider === "WalletConnect" ? (
        <div className="providerContent" onClick={onClick}>
          <div className="title">
            <div className="prologo">
              <img src="./connect.png" alt="" style={{ width: "100%" }} />
            </div>
            <div className="protext">WalletConnect</div>
          </div>
          <RightOutlined className="proarrow" />
        </div>
      ) : (
        <div className="providerContent" onClick={onClick}>
          <div className="title">
            <img src={provider.logo} alt="" className="prologo" height="54px" />
            <div className="protext">{provider.name}</div>
          </div>
          <RightOutlined className="proarrow" />
        </div>
      )}
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = createUseStyles<string, { isMobile: boolean }>((theme) => ({
  lightProviderModal: {
    minWidth: (cssProps) => (cssProps.isMobile ? "100%" : 448),
    top: (cssProps) => (cssProps.isMobile ? 0 : 100),
    margin: (cssProps) => (cssProps.isMobile ? 0 : "8px auto"),
    height: (cssProps) => (cssProps.isMobile ? "100vh" : "auto"),
    "& .ant-modal-content": {
      position: (cssProps) => (cssProps.isMobile ? "absolute" : "relative"),
      bottom: 0,
      minWidth: (cssProps) => (cssProps.isMobile ? "100%" : 448),
      maxHeight: "calc(100vh - 57px)",
      borderRadius: 0,
    },

    "& .ant-modal-body": {
      "& .ant-spin-blur::after": {
        border: "none",
        borderRadius: 16,
      },
      "& .ant-spin-container": {
        borderRadius: 16,
      },
      "& .ant-spin-spinning": {
        borderRadius: 16,
        opacity: 0.5,
        background: "#e6e6eb",
      },
      "& .ant-spin-nested-loading": {
        maxHeight: "100%",
        borderRadius: 16,
        "& .ant-spin": {
          borderRadius: 16,
        },
      },
    },
  },
  darkProviderModal: {
    minWidth: (cssProps) => (cssProps.isMobile ? "100%" : 448),
    top: (cssProps) => (cssProps.isMobile ? 0 : 100),
    margin: (cssProps) => (cssProps.isMobile ? 0 : "8px auto"),
    height: (cssProps) => (cssProps.isMobile ? "100vh" : "auto"),
    "& .ant-modal-content": {
      position: (cssProps) => (cssProps.isMobile ? "absolute" : "relative"),
      bottom: 0,
      minWidth: (cssProps) => (cssProps.isMobile ? "100%" : 448),
      maxHeight: "calc(100vh - 57px)",
      borderRadius: (cssProps) => (cssProps.isMobile ? "16px 16px 0 0" : 16),
    },

    "& .ant-modal-body": {
      "& .ant-spin-blur": {
        opacity: 0.4,
      },
      "& .ant-spin-blur::after": {
        opacity: 0.4,
      },
      "& .ant-spin-container::after": {
        background: "#2c2c2c",
      },
    },
  },
  errorInfo: {
    width: "100%",
    paddingTop: 72,
  },
  errorText: {
    fontWeight: 600,
    fontSize: 14,
    textAlign: "center",
  },
  primaryBtn: {
    marginTop: 16,
    width: "100%",
    height: 56,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    background: "#e4b462",
    color: "#000000",
    borderRadius: 16,
    border: "none",
  },
  checkBoxText: {
    fontSize: 12,
    fontWeight: 600,
    color: "#8F9BB3",
  },
  walletConnectContent: {
    width: "100%",
    paddingTop: 72,
  },
}));
function WalletConnectModal({
  visible,
  onCancel,
  onSelectWalletConnect,
}: WalletConnectProviderModalProps): JSX.Element {
  const { isMobile, themeType } = useContext(ColorThemeContext);
  const classes = useStyles({ isMobile });
  const [accept, setAccept] = useState(false);
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      className={classes.lightProviderModal}
      bodyStyle={{ padding: isMobile ? "0 16px 0 16px" : 24 }}
      title={null}
      maskClosable={false}
      closable
      footer={null}
      destroyOnClose
    >
      <div className="walletConnectContent">
        <div className="infoText">
          Only <span style={{ color: "#FFAA00" }}>non-Multisig, non-MPC</span>{" "}
          and <span style={{ color: "#FFAA00" }}>simple EOA address</span> is
          supported via Wallet Connect. Wallet Connect can be unstable from time
          to time, use at your own risk.
        </div>
        <div style={{ width: "100%", textAlign: "center", marginTop: 40 }}>
          <Checkbox
            onChange={(e) => {
              setAccept(e.target.checked);
            }}
            className={classes.checkBoxText}
          >
            I understand
          </Checkbox>
        </div>
        <div className="chainHopButton">
          <Button
            type="primary"
            disabled={!accept}
            className="primaryBtn"
            onClick={onSelectWalletConnect}
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}
export default function ProviderModal({
  visible,
  onCancel,
}: ProviderModalProps): JSX.Element {
  const { loadWeb3Modal, connecting } = useWeb3Context();

  const { isMobile } = useContext(ColorThemeContext);
  const classes = useStyles({ isMobile });
  const [isWalletConnect, setIsWalletConnect] = useState(false);
  const handleSelectProvider = async () => {
    setIsWalletConnect(false);
    await loadWeb3Modal("injected");
    onCancel();
  };

  const handleSelectWalletConnectProvider = async () => {
    await loadWeb3Modal(
      "walletconnect"
      // isMobile ? () => setConnectErroeVisible(true) : undefined
    );
    setIsWalletConnect(false);
    onCancel();
  };
  const handleSelectWalletConnect = async () => {
    onCancel();
    setIsWalletConnect(true);
  };
  return (
    <div>
      <Modal
        closable
        visible={visible}
        width={440}
        title="Connect Your Wallet"
        onCancel={onCancel}
        footer={null}
        maskClosable={false}
        bodyStyle={{ padding: "20px 24px 24px 24px" }}
        className={classes.lightProviderModal}
      >
        <div style={{ width: "100%" }}>
          <Spin spinning={connecting}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                rowGap: 16,
              }}
            >
              {isMobile ? (
                <>
                  <Provider
                    provider={injected.METAMASK}
                    onClick={handleSelectProvider}
                  />
                  {/* <Provider
                    provider={injected.IMTOKEN}
                    onClick={handleSelectProvider}
                  />
                  <Provider
                    provider={injected.COINBASE}
                    onClick={handleSelectProvider}
                  /> */}
                </>
              ) : (
                <>
                  <Provider
                    provider={injected.METAMASK}
                    onClick={handleSelectProvider}
                  />
                  {/* <Provider
                    provider="WalletConnect"
                    onClick={handleSelectWalletConnect}
                  /> */}
                </>
              )}
            </div>
            <div className="acceptDes">
              By connecting, I accept Celer Network
            </div>
            <div className="termsOfus">Terms of Use</div>
          </Spin>
        </div>
      </Modal>
      {/* {isWalletConnect && (
        <WalletConnectModal
          visible={isWalletConnect}
          onCancel={() => {
            setIsWalletConnect(false);
          }}
          onSelectWalletConnect={handleSelectWalletConnectProvider}
        />
      )} */}
    </div>
  );
}
