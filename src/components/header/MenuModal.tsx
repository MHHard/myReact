import React, { useContext } from "react";
import { Button, Modal } from "antd";
import { createUseStyles } from "react-jss";
import Icon from "@ant-design/icons";
import { ColorThemeContext } from "../../providers/ThemeProvider";
import { Theme } from "../../theme";
// import themeLightIcon from "../../images/light.svg";
// import themeDarkIcon from "../../images/dark.svg";
import { ReactComponent as light } from "../../images/light.svg";
import { ReactComponent as dark } from "../../images/dark.svg";
// import CoinBasePay from "../../views/CoinBasePay";
import { getHeaderLinkList, openLink } from "./LinkList";

const useStyles = createUseStyles((theme: Theme) => ({
  modal: {
    width: "100%",
    minWidth: "100%",
    height: "100%",
    border: "0",
    top: 0,
    borderRadius: 0,
    margin: 0,
    "& .ant-modal-content": {
      background: theme.globalBg,
      height: "100%",
      borderRadius: 0,
      "& .ant-modal-header": {
        background: "transparent",
        borderRadius: 0,
      },
      "& .ant-modal-body": {
        height: "100%",
        padding: 0,
        background: "transparent",
      },
    },
  },
  content: {
    paddingTop: 50,
    display: "grid",
    gridTemplateColumns: "auto",
    rowGap: 10,
    justifyContent: "flex-start",
    background: "transparent",
  },
  whiteText: {
    fontSize: 16,
    color: theme.surfacePrimary,
    fontWeight: 700,
    textAlign: "center",
  },
  grayText: {
    fontSize: 12,
    color: theme.secondBrand,
    fontWeight: 600,
    textAlign: "left",
    "&:focus, &:hover": {
      color: theme.surfacePrimary,
      background: "transparent",
    },
  },
  grayTextLight: {
    fontSize: 12,
    color: theme.surfacePrimary,
    fontWeight: 600,
    textAlign: "left",
    "&:focus, &:hover": {
      color: theme.surfacePrimary,
      background: "transparent",
    },
  },
  bottomContent: {
    display: "flex",
    flexFlow: "column",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    bottom: 66,
  },
  iconWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 24px)",
    columnGap: 24,
    height: 24,
    marginTop: 22,
    fontSize: 24,
    color: theme.secondBrand,
  },
  flexBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  flexBtnContent: {
    borderRadius: 12,
    background: theme.secondBackground,
    gap: 7,
    fontWeight: 700,
    fontSize: 16,
    color: theme.surfacePrimary,
    padding: 7,
  },
  flexBtnIcon: {
    fontSize: 26,
    color: theme.surfacePrimary,
    marginRight: 7,
    width: 26,
    height: 26,
    pointerEvents: "none",
  },
  themeBtn: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 12,
    color: theme.secondBrand,
    fontWeight: 600,
    textAlign: "left",
    paddingRight: 0,
    "& svg g": {
      stroke: theme.secondBrand,
    },
    "& svg path": { fill: theme.secondBrand },
    "&:hover": {
      color: theme.surfacePrimary,
      "& svg g": {
        stroke: theme.surfacePrimary,
      },
      "& svg path": { fill: theme.surfacePrimary },
    },
  },
  line: {
    width: "calc(100vw - 32px)",
    marginLeft: 16,
    height: 1,
    background: theme.primaryBorder,
  },
  historyIconLeft: {
    color: theme.surfacePrimary,
    width: 24,
    height: 24,
    marginRight: 4,
    marginLeft: 8,
    pointerEvents: "none",
  },
}));

type MenuModalProps = {
  visible: boolean;
  onCancel: () => void;
};

function MenuModal({ visible, onCancel }: MenuModalProps) {
  const styles = useStyles();
  const { themeType, toggleTheme } = useContext(ColorThemeContext);
  const toggleIconUrl = themeType === "dark" ? light : dark;

  // const bottomContent = () => {
  //   return (
  //     <div className={styles.bottomContent}>
  //       <span className={styles.whiteText}>Follow Us</span>
  //       <div className={styles.iconWrapper}>
  //         <DiscordCircleFilled onClick={() => window.open("https://discord.gg/uGx4fjQ", "_blank")} />
  //         <TelegramCircleFilled onClick={() => window.open("https://t.me/celernetwork", "_blank")} />
  //         <TwitterCircleFilled onClick={() => window.open("https://twitter.com/CelerNetwork", "_blank")} />
  //         <GithubFilled onClick={() => window.open("https://github.com/celer-network/cbridge-node", "_blank")} />
  //       </div>
  //     </div>
  //   );
  // };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const childRef = useRef<any>(null);
  // const openCoinbase = () => {
  //   if (childRef.current) {
  //     childRef.current?.openCoinBasePay();
  //   }
  // };
  const linkList = getHeaderLinkList(themeType);
  const isTest = process.env.REACT_APP_ENV_TYPE === "test";
  const isMainnet = process.env.REACT_APP_ENV === "MAINNET";
  const functionList = {
    Faucets: () => {},
    Analytics: () => openLink("Analytics"),
    Explorer: () => openLink("Explorer"),
    Staking: () => openLink("Staking"),
  };
  return (
    <Modal className={styles.modal} title="" closable visible={visible} onCancel={onCancel} footer={null}>
      <div className={styles.content}>
        <Button
          className={styles.grayText}
          type="text"
          onClick={() => window.open("https://cbridge-docs.celer.network", "_blank")}
        >
          Docs
        </Button>
        <Button
          className={styles.grayText}
          type="text"
          onClick={() => window.open("https://cbridge-docs.celer.network/tutorial", "_blank")}
        >
          Tutorial
        </Button>
        <Button
          className={styles.grayText}
          type="text"
          onClick={() => window.open("https://cbridge-docs.celer.network/faq", "_blank")}
        >
          FAQ
        </Button>
        <Button
          className={styles.grayText}
          type="text"
          onClick={() => window.open("https://cbridge-docs.celer.network/reference/audit-reports", "_blank")}
        >
          Audit Reports
        </Button>
        <Button
          className={styles.grayText}
          type="text"
          onClick={() => window.open("https://cbridge-docs.celer.network/developer", "_blank")}
        >
          SDK
        </Button>
        <Button
          className={styles.grayText}
          type="text"
          onClick={() => window.open("https://form.typeform.com/to/Q4LMjUaK", "_blank")}
        >
          Contact Support
        </Button>
        <Button
          className={styles.grayText}
          type="text"
          onClick={() => window.open("https://cbridge-docs.celer.network/reference/token-addresses", "_blank")}
        >
          Contract Addresses
        </Button>
        <Button
          className={styles.grayText}
          type="text"
          onClick={() => window.open("https://immunefi.com/bounty/celer", "_blank")}
        >
          Bug Bounty
        </Button>
        {/* <Button
          key="CoinBasePay"
          className={styles.grayText}
          type="text"
          onClick={() => {
            openCoinbase();
          }}
        >
          <CoinBasePay ref={childRef} />
        </Button> */}
        <Button className={styles.themeBtn} type="text" size="large" onClick={toggleTheme}>
          <div>{themeType === "dark" ? "Light Theme" : "Dark Theme"} </div>
          <Icon component={toggleIconUrl} style={{ fontSize: 13 }} />
        </Button>
        <div className={styles.line} />
        {linkList?.map(item => {
          return (
            ((item.isTestShow && isTest) || (item.isMainnetShow && isMainnet) || item.isMobileShow) &&
            item.linkText !== "Faucets" && (
              <Button
                className={styles.grayTextLight}
                type="text"
                key={item.linkText}
                onClick={functionList[item?.linkText]}
              >
                <img src={item?.linkIcon} className={styles.historyIconLeft} alt={item?.linkText} />
                {item.linkText}
              </Button>
            )
          );
        })}

        {/* <div className={styles.flexBtn} onClick={() => window.open("https://cbridge-campaign.netlify.app/")}>
          <div className={styles.flexBtnContent} style={{ padding: "10px 8px" }}>
            <img src={leaderboardIcon} className={styles.flexBtnIcon} alt="" />
            Leaderboard
          </div>
        </div> */}
        {/* {!isMobile&&(
          <div className={styles.flexBtn} onClick={() => window.open("https://test-sgn.celer.network/")}>
            <div className={styles.flexBtnContent} style={{ padding: "10px 8px" }}>
              <img src={sgnIcon} className={styles.flexBtnIcon} alt="" />
              SGN
            </div>
          </div>
        )} */}

        {/* {bottomContent()} */}
      </div>
      {/* {showFaucet && <FaucetModal tokenInfos={tokenInfo} onClose={closeFaucet} />} */}
    </Modal>
  );
}

export default MenuModal;
