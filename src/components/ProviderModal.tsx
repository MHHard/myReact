import { useState } from "react";
import { Avatar, Button, Checkbox, Modal, Space, Spin, Typography } from "antd";
import classNames from "classnames";
import { createUseStyles } from "react-jss";
import { injected } from "@celer-network/web3modal";
import { RightOutlined } from "@ant-design/icons";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import ActionTitle from "./common/ActionTitle";
import { Theme } from "../theme/theme";
import { useAppSelector } from "../redux/store";
import cloverLogo from "../providers/logos/clover.svg";
import dcentLogo from "../providers/logos/dcent1.png";
import tokenPocketLogo from "../providers/logos/token-pocket.jpg";
import coinbaseLogo from "../providers/logos/coinbase.png";
import safepalLogo from "../providers/logos/safepal.jpeg";
import bitkeepLogo from "../providers/logos/bitkeep.svg";

import { storageConstants } from "../constants/const";

const { Text } = Typography;

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  connectModal: {
    width: "100%",
    minWidth: props => (props.isMobile ? "100%" : 500),
    background: theme.secondBackground,
    border: `1px solid ${theme.primaryBackground}`,
    "& .ant-modal-content": {
      background: theme.secondBackground,
      boxShadow: props => (props.isMobile ? "none" : ""),
      "& .ant-modal-close": {
        color: theme.surfacePrimary,
      },
      "& .ant-modal-header": {
        background: theme.secondBackground,
        borderBottom: "none",
        "& .ant-modal-title": {
          color: theme.surfacePrimary,
          "& .ant-typography": {
            color: theme.surfacePrimary,
          },
        },
      },
      "& .ant-modal-body": {
        "& .ant-spin-blur": {
          border: "none",
          borderRadius: 16,
        },
        "& .ant-spin-spinning": {
          borderRadius: 16,
          opacity: 0.8,
          background: theme.primaryBackground,
        },
        "& .ant-spin-nested-loading": {
          "& .ant-spin": {
            maxHeight: "100%",
          },
        },
      },
      "& .ant-modal-footer": {
        border: "none",
        padding: props => (props.isMobile ? "8px 16px" : "10px 16px"),
        "& .ant-btn-link": {
          color: theme.primaryBrand,
        },
      },
    },
    "& .ant-typography": {
      color: theme.surfacePrimary,
    },
  },
  provider: {
    background: theme.primaryBackground,
    border: "none",
    borderRadius: 16,
    width: "100%",
    height: 60,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    "& .ant-typography": {
      color: theme.surfacePrimary,
    },
    "@global": {
      ".ant-spin": {
        marginTop: 6,
      },
    },
  },
  arrow: {
    marginRight: 15,
    color: theme.surfacePrimary,
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: props => (props.isMobile ? 0 : 16),
  },
  errorInfo: {
    width: "100%",
    paddingTop: 72,
  },
  errorText: {
    fontWeight: 600,
    fontSize: 14,
    color: theme.surfacePrimary,
    textAlign: "center",
  },
  errorBtn: {
    marginTop: 16,
    width: "100%",
    height: 56,
    lineHeight: "56px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    background: theme.primaryBrand,
    color: theme.unityWhite,
    borderRadius: 16,
  },
  primaryBtn: {
    marginTop: 16,
    width: "100%",
    height: 56,
    // lineHeight: "56px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    background: theme.primaryBrand,
    color: theme.unityWhite,
    borderRadius: 16,
    border: "none",
  },
  checkBoxText: {
    color: theme.secondBrand,
    fontSize: 12,
    fontWeight: 600,
  },
}));

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
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  return (
    <>
      {provider === "WalletConnect" ? (
        <div className={classNames(classes.provider)} onClick={onClick}>
          <Space>
            <img src="./connect.png" alt="" style={{ width: 32 }} />
            <Text>WalletConnect</Text>
          </Space>
          <RightOutlined className={classes.arrow} />
        </div>
      ) : (
        <div className={classNames(classes.provider)} onClick={onClick}>
          <Space>
            <Avatar src={provider.logo} shape="circle" />
            <Text>{provider.name}</Text>
          </Space>
          <RightOutlined className={classes.arrow} />
        </div>
      )}
    </>
  );
}

function Footer() {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });

  return (
    <div className={classes.footer}>
      <Text>By connecting, I accept</Text>
      <Text>
        <Button
          type="link"
          size="small"
          onClick={() => window.open("https://get.celer.app/cbridge-v2-doc/tos-cbridge-2.pdf")}
        >
          Terms of Use
        </Button>
      </Text>
    </div>
  );
}

function ConnectErrorModal({ visible, onCancel }: ProviderModalProps): JSX.Element {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      className={classes.connectModal}
      bodyStyle={{ padding: isMobile ? "0 16px 0 16px" : 24 }}
      title={null}
      maskClosable={false}
      closable
      footer={null}
    >
      <div className={classes.errorInfo}>
        <div className={classes.errorText}>
          Wallet not detected. Please use cBridge in a desktop browser with Metamask installed or a mobile wallet dApp
          browser.
        </div>
        <div className={classes.errorBtn} onClick={onCancel}>
          OK
        </div>
      </div>
    </Modal>
  );
}
function WalletConnectModal({
  visible,
  onCancel,
  onSelectWalletConnect,
}: WalletConnectProviderModalProps): JSX.Element {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const [accept, setAccept] = useState(false);
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      className={classes.connectModal}
      bodyStyle={{ padding: isMobile ? "0 16px 0 16px" : 24 }}
      title={null}
      maskClosable={false}
      closable
      footer={null}
      destroyOnClose
    >
      <div className={classes.errorInfo}>
        <div className={classes.errorText}>
          Only <span style={{ color: "#FFAA00" }}>non-Multisig, non-MPC</span> and{" "}
          <span style={{ color: "#FFAA00" }}>simple EOA address</span> is supported via Wallet Connect. Wallet Connect
          can be unstable from time to time, use at your own risk.
        </div>
        <div style={{ width: "100%", textAlign: "center", marginTop: 40 }}>
          <Checkbox
            onChange={e => {
              setAccept(e.target.checked);
            }}
            className={classes.checkBoxText}
          >
            I understand
          </Checkbox>
        </div>

        <Button type="primary" disabled={!accept} className={classes.primaryBtn} onClick={onSelectWalletConnect}>
          Continue
        </Button>
      </div>
    </Modal>
  );
}
export default function ProviderModal({ visible, onCancel }: ProviderModalProps): JSX.Element {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const [connectErrorVisible, setConnectErroeVisible] = useState(false);
  const [isWalletConnect, setIsWalletConnect] = useState(false);
  const { loadWeb3Modal, connecting } = useWeb3Context();
  const handleSelectProvider = async (name: string) => {
    localStorage.setItem(storageConstants.KEY_CONNECTED_WALLET_NAME, name);
    setIsWalletConnect(false);
    await loadWeb3Modal("injected", isMobile ? () => setConnectErroeVisible(true) : undefined);
    onCancel();
  };
  const handleSelectWalletConnectProvider = async () => {
    localStorage.setItem(storageConstants.KEY_CONNECTED_WALLET_NAME, "walletconnect");
    await loadWeb3Modal("walletconnect", isMobile ? () => setConnectErroeVisible(true) : undefined);
    setIsWalletConnect(false);
    onCancel();
  };
  const handleSelectWalletConnect = async () => {
    onCancel();
    setIsWalletConnect(true);
  };
  return (
    <>
      <Modal
        closable
        visible={visible}
        className={classes.connectModal}
        title={<ActionTitle title="Connect Your Wallet" />}
        onCancel={onCancel}
        footer={<Footer />}
        maskClosable={false}
        bodyStyle={{ padding: isMobile ? "0 16px 0 16px" : 24 }}
      >
        <div style={{ width: "100%" }}>
          <Spin spinning={connecting}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", rowGap: 8 }}>
              <Provider provider={injected.METAMASK} onClick={() => handleSelectProvider(injected.METAMASK.name)} />
              <Provider
                provider={{
                  name: "TokenPocket",
                  logo: tokenPocketLogo,
                }}
                onClick={() => handleSelectProvider("tokenPocket")}
              />
              <Provider
                provider={{
                  name: "Coinbase Wallet",
                  logo: coinbaseLogo,
                }}
                onClick={() => handleSelectProvider("coinbase")}
              />
              <Provider provider="WalletConnect" onClick={handleSelectWalletConnect} />
              <Provider
                provider={{
                  name: "Clover",
                  logo: cloverLogo,
                }}
                onClick={() => {
                  localStorage.setItem(storageConstants.KEY_IS_CLOVER_WALLET, "true");
                  handleSelectProvider("clover");
                }}
              />
              <Provider provider={injected.OKXWALLET} onClick={() => handleSelectProvider(injected.OKXWALLET.name)} />

              {isMobile ? (
                <>
                  <Provider provider={injected.IMTOKEN} onClick={() => handleSelectProvider(injected.IMTOKEN.name)} />
                  <Provider
                    provider={injected.MATHWALLET}
                    onClick={() => handleSelectProvider(injected.MATHWALLET.name)}
                  />
                  <Provider
                    provider={injected.ONTOWALLET}
                    onClick={() => handleSelectProvider(injected.ONTOWALLET.name)}
                  />
                  <Provider
                    provider={injected.COIN98WALLET}
                    onClick={() => handleSelectProvider(injected.COIN98WALLET.name)}
                  />
                  <Provider
                    provider={{
                      name: "D'CENT Wallet",
                      logo: dcentLogo,
                    }}
                    onClick={() => handleSelectProvider("dcent")}
                  />
                  <Provider
                    provider={{
                      name: "SafePal",
                      logo: safepalLogo,
                    }}
                    onClick={() => handleSelectProvider("safePal")}
                  />
                  <Provider
                    provider={{
                      name: "Bitkeep",
                      logo: bitkeepLogo,
                    }}
                    onClick={() => handleSelectProvider("bitkeep")}
                  />
                </>
              ) : null}
            </div>
          </Spin>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "16px 0 0",
              color: "#FFAA00",
            }}
          >
            <div>*Beta software. Use at your own risk!</div>
          </div>
          {isMobile ? null : <div style={{ height: 30 }} />}
        </div>
      </Modal>
      <ConnectErrorModal visible={connectErrorVisible} onCancel={() => setConnectErroeVisible(!connectErrorVisible)} />
      {isWalletConnect && (
        <WalletConnectModal
          visible={isWalletConnect}
          onCancel={() => {
            setIsWalletConnect(false);
          }}
          onSelectWalletConnect={handleSelectWalletConnectProvider}
        />
      )}
    </>
  );
}
