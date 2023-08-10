import { createUseStyles } from "react-jss";
import { useContext, useState, useMemo, useCallback } from "react";
import { PageHeader, Button, Modal, Image } from "antd";
import { LoadingOutlined, MenuOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { ColorThemeContext } from "../../providers/ThemeProvider";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { openModal, ModalName } from "../../redux/modalSlice";
import { setIsChainShow, setChainSource } from "../../redux/transferSlice";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { Theme } from "../../theme/theme";
import Account from "./Account";
import cbridgeLogo from "../../images/cbridgeLogo.svg";
import cBrdige2Light from "../../images/cBridgeLight.svg";
import cBrdige2Dark from "../../images/cBridgeDark.svg";
import homeHistoryIcon from "../../images/homehistory.svg";
import lightHomeHistory from "../../images/lightHomeHistory.svg";
import dark from "../../images/dark.svg";
import light from "../../images/light.svg";

import { Chain } from "../../constants/type";
import HistoryButton from "./HistoryButton";

const useStyles = createUseStyles((theme: Theme) => ({
  header: {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    marginTop: 12,
    marginBottom: 12,
    zIndex: 10,
    width: "100%",
  },
  hleft: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  line: {
    width: 2,
    height: 16,
    background: theme.surfacePrimary,
  },
  start: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "5px 12px",
    marginLeft: 12,
  },
  startTitle: {
    fontSize: 12,
    color: theme.secondBrand,
    fontWeight: "bold",
  },
  startNum: {
    fontSize: 18,
    color: theme.data,
    fontWeight: "bold",
  },

  themeIcon: {
    marginLeft: 10,
    padding: 12,
    height: "auto",
    lineHeight: "initial",
    borderRadius: 12,
    alignItems: "center",
    background: theme.secondBackground,
    cursor: "pointer",
    boxSizing: "border-box",
    border: "1px solid transparent",
    "&:hover": {
      border: `1px solid ${theme.primaryBorder}`,
    },
  },
  historyBtn: {
    background: theme.secondBackground,
    backdropFilter: "blur(20px)",
    border: "none",
    height: 48,
    borderRadius: 12,
    color: theme.surfacePrimary,
    display: "flex",
    alignItems: "center",
  },
  historyIcon: {
    color: theme.surfacePrimary,
    marginRight: 7,
    width: 24,
    height: 24,
    pointerEvents: "none",
  },

  chainIcon: {
    color: theme.surfacePrimary,
    marginRight: 7,
    width: 24,
    height: 24,
    borderRadius: 12,
    pointerEvents: "none",
  },
  historyIconLeft: {
    color: theme.surfacePrimary,
    width: 24,
    height: 24,
    pointerEvents: "none",
  },
  historyIcon2: {
    marginRight: 7,
    position: "absolute",
    top: -1,
  },
  historyText: {
    color: theme.unityWhite,
  },
  faucetsText: {
    color: theme.surfacePrimary,
  },
  chainLocale: {
    display: "flex",
    alignItems: "center",
    background: theme.secondBackground,
    borderRadius: 12,
    padding: "0 8px",
    marginLeft: 8,
    cursor: "pointer",
    height: 44,
    boxSizing: "border-box",
    border: "1px solid transparent",
    "&:hover": {
      border: `1px solid ${theme.primaryBorder}`,
    },
  },
  activeChainLocale: {
    display: "flex",
    alignItems: "center",
    background: theme.primaryBrand,
    borderRadius: 12,
    padding: "10px 8px",
    marginLeft: 8,
    cursor: "pointer",
  },
  chainLocaleimg: {
    width: 32,
    height: 32,
    borderRadius: "50%",
  },
  chainLocaleName: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 700,
    color: theme.surfacePrimary,
  },
  historyIner: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    fontWeight: 700,
    position: "relative",
    zIndex: 300,
  },
  dot: {
    width: 15,
    height: 15,
    border: "1px solid #fff",
    borderRadius: "50%",
    background: theme.infoDanger,
    position: "absolute",
    top: -13,
    right: -13,
  },
  link: {
    color: "#ffffff",
    padding: "6.4px 12px",
  },
  menuBtn: {
    color: theme.surfacePrimary,
    background: "transparent",
    border: 0,
    marginLeft: 2,
    boxShadow: "none",
    "&:focus, &:hover": {
      color: theme.surfacePrimary,
      background: "transparent",
    },
  },
  mobilePageHeaderWrapper: {
    display: "flex",
    flexFlow: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  mobileLogoWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "12px 20px 12px 15px",
  },
  mobileHeaderPanel: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  mobileViewTab: {
    width: "100%",
  },
  headerLeft: {
    // width: "calc(50vw - 208px)",
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    "& .ant-page-header": {
      padding: "13px 12px 13px 0",
    },
  },
  headerCenter: {
    height: 45,
  },
  headerRight: {
    // width: "calc(50vw - 208px)",
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
  },
  leaderboardBox: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    cursor: "pointer",
    gap: 4,
    height: 44,
    marginLeft: 4,
    borderRadius: 12,
    background: theme.secondBackground,
    fontWeight: 700,
    fontSize: 14,
    padding: "10px 8px",
    color: theme.surfacePrimary,
    boxSizing: "border-box",
    border: "1px solid transparent",
    "&:hover": {
      border: `1px solid ${theme.primaryBorder}`,
    },
  },
  SGNModal: {
    border: `1px solid ${theme.primaryBackground}`,
    "& .ant-modal-content": {
      background: theme.secondBackground,
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
        minHeight: 235,
      },
      "& .ant-modal-footer": {
        border: "none",
        "& .ant-btn-link": {
          color: theme.primaryBrand,
        },
      },
    },
    "& .ant-typography": {
      color: theme.surfacePrimary,
    },
  },
  modaldes: {
    color: theme.surfacePrimary,
    marginTop: 50,
    fontSize: 14,
    fontWeight: 600,
    textAlign: "center",
  },
  button: {
    height: 56,
    lineHeight: "42px",
    background: theme.primaryBrand,
    border: 0,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: 700,
    marginTop: 24,
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
  logoWrapper: {
    cursor: "pointer",
  },
  btnHover: {
    "&:hover": {
      border: `1px solid ${theme.primaryBorder}`,
    },
  },
}));

export default function Header({ showHistory }): JSX.Element {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles();
  const [sGNModalState, setSGNModalState] = useState(false);
  const { themeType, toggleTheme } = useContext(ColorThemeContext);
  const { network, signer, chainId, getNetworkById } = useWeb3Context();
  const dispatch = useAppDispatch();
  const { totalActionNum, totalPaddingNum, transferConfig, fromChain } = useAppSelector(state => state.transferInfo);
  // const logoUrl = isMobile && signer ? cBridgeIcon : themeType === "dark" ? cBrdige2Dark : cBrdige2Light;
  const logoUrl = cbridgeLogo;
  const biglogoUrl = themeType === "dark" ? cBrdige2Light : cBrdige2Dark;
  const toggleIconUrl = themeType === "dark" ? light : dark;

  const currentChainInfo: Chain | undefined = useMemo(() => {
    if (transferConfig.chains.length > 0 && fromChain) {
      const chainInfo = transferConfig.chains.find(it => it.id === fromChain.id);
      return chainInfo;
    }
    return undefined;
  }, [transferConfig, fromChain]);

  const showChain = type => {
    dispatch(setChainSource(type));
    dispatch(setIsChainShow(true));
  };

  const handleOpenHistoryModal = () => {
    dispatch(openModal(ModalName.history));
  };

  const getstatusText = () => {
    let content;
    if (totalActionNum) {
      content = (
        <div className={classes.historyIner}>
          <img className={classes.historyIcon2} width={22} key="1" src="./actionLogo.svg" alt="" />
          <span style={{ marginLeft: 30 }}>{`${totalActionNum} Action${
            Number(totalActionNum) !== 1 ? "s" : ""
          } Required`}</span>
          <div className={classes.dot} />
        </div>
      );
    } else if (totalPaddingNum) {
      content = (
        <div className={classes.historyIner}>
          <span>{` ${totalPaddingNum} Pending`}</span>
          <LoadingOutlined style={{ fontSize: 18, marginRight: 6, fontWeight: 700, marginLeft: 6, color: "#fff" }} />
        </div>
      );
    } else {
      content = (
        <div
          className={classes.historyIner}
          style={
            themeType === "dark"
              ? { background: "#232530", color: "#ffffff" }
              : { background: "#ffffff", color: "#2e3a59" }
          }
        >
          <img
            key="3"
            src={themeType === "dark" ? homeHistoryIcon : lightHomeHistory}
            className={classes.historyIcon}
            alt="homeHistoryIcon icon for fauset"
            style={{ marginRight: 0 }}
          />
          History
        </div>
      );
    }
    return content;
  };
  const handleShowMenuModal = useCallback(() => {
    dispatch(openModal(ModalName.menu));
  }, [dispatch]);

  if (isMobile) {
    return (
      <div className={classes.mobilePageHeaderWrapper}>
        <div className={classes.mobileLogoWrapper}>
          <span
            onClick={() => {
              window.location.reload();
            }}
            style={{ height: 14 }}
          >
            <img
              src={logoUrl}
              height="14px"
              alt="cBridge"
              style={{ position: "absolute", left: 15, marginBottom: 2 }}
            />
          </span>

          <div className={classes.mobileHeaderPanel} style={{ flex: "1 0 auto" }}>
            <div style={{ marginRight: 2 }}>{signer && showHistory && <HistoryButton />}</div>
            <Account />
            <Button type="primary" className={classes.menuBtn} icon={<MenuOutlined />} onClick={handleShowMenuModal} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.header}>
      <div className={classes.hleft}>
        <div className={classes.headerLeft}>
          <div id="logoWrapper" className={classes.logoWrapper}>
            <PageHeader
              title={
                <div>
                  <span
                    onClick={() => {
                      window.location.reload();
                    }}
                    className="logo"
                  >
                    <img src={logoUrl} height="26px" alt="cBridge" />
                  </span>
                  <span
                    onClick={() => {
                      window.location.reload();
                    }}
                    className="biglogoImg"
                  >
                    <img src={biglogoUrl} height="55px" alt="cBridge" />
                  </span>
                </div>
              }
              style={{ paddingRight: 0 }}
            />
          </div>
        </div>
        {/* {!isFromSEO && (
          <div className="tabBody">
            <ViewTab />
          </div>
        )} */}
      </div>

      <div className={classes.headerRight}>
        <div>
          <div
            className={totalActionNum || totalPaddingNum ? classes.activeChainLocale : classes.chainLocale}
            onClick={() => {
              handleOpenHistoryModal();
            }}
          >
            <div className={classes.historyText}>{getstatusText()}</div>
          </div>
        </div>
        {signer && (
          <div
            className={classNames("chainLocale", classes.btnHover)}
            style={
              themeType === "dark"
                ? { background: "#232530", color: "#ffffff" }
                : { background: "#ffffff", color: "#2e3a59" }
            }
            onClick={() => {
              showChain("wallet");
            }}
          >
            <Image
              className={classes.chainIcon}
              style={{ marginRight: 0 }}
              alt=""
              src={currentChainInfo?.icon}
              preview={false}
              placeholder={
                <Image preview={false} src="./noChain.png" className={classes.chainIcon} style={{ marginRight: 0 }} />
              }
            />
            <div className="chinName">
              <span style={{ maxLines: 1, whiteSpace: "nowrap" }}>
                {getNetworkById(currentChainInfo?.id ?? chainId)?.name !== "--"
                  ? getNetworkById(currentChainInfo?.id ?? chainId)?.name
                  : network}
              </span>
            </div>
          </div>
        )}
        <div className="account">
          <Account />
        </div>
        <div className="themeChange">
          <div className={classes.themeIcon} onClick={toggleTheme}>
            <div style={{ width: 20, height: 20 }}>
              <img src={toggleIconUrl} style={{ width: "100%", height: "100%" }} alt="protocol icon" />
            </div>
          </div>
        </div>

        <Modal
          title=""
          width={512}
          onCancel={() => {
            setSGNModalState(false);
          }}
          visible={sGNModalState}
          footer={null}
          maskClosable={false}
          destroyOnClose
          className={classes.SGNModal}
          bodyStyle={{ padding: "24px 18px 24px 18px" }}
        >
          <div>
            <div className={classes.modaldes} style={{ marginBottom: 20 }}>
              SGN staking will be open to public soon. Please stay tuned.
            </div>
            <Button
              type="primary"
              size="large"
              block
              onClick={() => {
                setSGNModalState(false);
              }}
              className={classes.button}
            >
              OK
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
