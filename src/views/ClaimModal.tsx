import { Button, Modal } from "antd";
import { ButtonType } from "antd/lib/button";
import { createUseStyles } from "react-jss";
import { useContext } from "react";
import { CheckCircleFilled, WarningFilled } from "@ant-design/icons";
import { ColorThemeContext } from "../providers/ThemeProvider";
import { ClaimType, Reward } from "../constants/type";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { switchChain, setFromChain } from "../redux/transferSlice";
import { Theme } from "../theme";
import { formatBlockExplorerUrlWithTxHash } from "../utils/formatUrl";

/* eslint-disable*/

// import { IRelayNode } from "../TransferContent";
export interface IRelayNode {
  feePercentage: string;
  fromChainTokenAddr: string;
  ip: string;
  relayNodeAddr: string;
  toChainRelayNodeBalance: string;
  toChainTokenAddr: string;
  tokenGas: number;
  successRate: number;
  err: { code: string; msg: string };
}

const useStyles = createUseStyles((theme: Theme) => ({
  balanceText: {
    textDecoration: "underline",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  countdown: {
    fontSize: 14,
    fontWeight: 600,
  },
  explanation: {
    color: theme.infoSuccess,
    marginBottom: 24,
  },
  historyDetail: {
    width: "100%",
  },
  detailItem: {
    borderBottom: `1px solid ${theme.primaryBorder}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    padding: "12px 0",
    marginTop: 30,
  },
  detailItemBto: {
    borderBottom: `1px solid ${theme.primaryBorder}`,
    padding: "12px 0",
  },
  detailItemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemLeft: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "left",
  },
  itemContImg: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    marginRight: 8,
  },
  itemRight: {
    textAlign: "right",
  },
  itemText: {},
  itemTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: theme.surfacePrimary,
  },
  itemTextDes: {
    fontSize: 12,
    fontWeight: 400,
    color: theme.secondBrand,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: 400,
    color: theme.infoDanger,
  },
  totalValueRN: {
    fontSize: 15,
    fontWeight: 400,
    color: theme.infoSuccess,
  },
  fromNet: {
    fontSize: 12,
    fontWeight: 400,
    color: theme.secondBrand,
  },
  expe: {
    fontSize: 12,
    color: theme.infoSuccess,
    textAlign: "left",
    paddingTop: 30,
  },
  time: {
    fontSize: 16,
    color: theme.infoSuccess,
    textAlign: "right",
  },
  modalTop: {},
  modalTopDes: {
    fontSize: 14,
  },
  modalTopTitle: {
    fontSize: 12,
    width: "100%",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: 600,
    color: theme.surfacePrimary,
  },
  transferdes: {
    fontSize: 12,
    width: "100%",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: 600,
    color: theme.surfacePrimary,
  },
  modalToptext: {
    fontSize: 15,
    width: "100%",
    textAlign: "center",
    fontWeight: 600,
    color: theme.surfacePrimary,
    lineHeight: 1,
  },
  modalsuccetext: {
    fontSize: 22,
    width: "100%",
    textAlign: "center",
    fontWeight: 600,
    color: theme.infoSuccess,
  },
  modalTopTitleNotice: {
    fontSize: 14,
    fontWeight: 400,
    width: "100%",
    textAlign: "center",
    marginBottom: 20,
  },
  modalTopIcon: {
    fontSize: 16,
    fontWeight: 600,
    width: "100%",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 45,
  },
  addToken: {
    color: "#0c82ff",
    fontSize: 13,
    padding: "10px 10px",
    borderRadius: "100px",
    background: "rgba(14,129,251,0.2)",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    justifyContent: "center",
    marginTop: 40,
  },
  button: {
    marginTop: 40,
    height: 56,
    lineHeight: "42px",
    background: theme.primaryBrand,
    borderRadius: 16,
    border: "none",
    fontSize: 18,
    fontWeight: 700,
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
  resultText: {
    color: theme.surfacePrimary,
  },
  modaldes: {
    color: theme.surfacePrimary,
    marginTop: 40,
    fontSize: 15,
    textAlign: "center",
  },
  modaldes2: {
    color: theme.surfacePrimary,
    marginTop: 30,
    fontSize: 18,
    textAlign: "center",
  },
  yellowText: {
    color: theme.infoWarning,
    display: "inline-block",
  },
  transitem: {},
  transitemTitle: {
    //   background: theme.dark.contentBackground,
    color: theme.surfacePrimary,
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    // padding: "0 12px",
  },
  transcontent: {
    borderRadius: "16px",
    background: theme.primaryBackground,
    padding: "15px 0",
    marginTop: 5,
  },
  icon: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px 0 10px 0",
  },
  source: {
    display: "inline-block",
    marginRight: 8,
    fontSize: 15,
  },
  transselect: {
    background: theme.primaryBackground,
    display: "inline-block",
    minWidth: 100,
    borderRadius: 100,
  },
  transChainame: {
    fontSize: 15,
  },
  transnum: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    color: theme.secondBrand,
  },
  transnumtext: {
    //   color: theme.dark.lowTextColor,
    fontSize: 14,
    color: theme.secondBrand,
  },
  transnumlimt: {
    //   color: theme.dark.midTextColor,
    //   fontSize: theme.transferFontS,
    borderBottom: "1px solid #8f9bb3",
    cursor: "pointer",
  },
  transexp: {
    //   color: theme.dark.midTextColor,
    fontSize: 14,
  },
  transndes: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    marginTop: 18,
  },
  transdestext: {
    //   fontSize: theme.transferFontXl,
    //   color: theme.dark.midTextColor,
    flex: 2,
  },
  transdeslimt: {
    position: "relative",
    flex: 1,
  },
  chainSelcet: {
    borderRadius: "100px",
    background: "#0a0a0a",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    //   fontSize: theme.transferFontM,
    //   color: theme.dark.heiTextColor,
    paddingLeft: 8,
    paddingRight: 10,
    height: 40,
  },
  investSelct: {
    display: "flex",
    position: "absolute",
    top: -13,
    right: 0,
    alignItems: "center",
  },
  selectdes: {
    marginLeft: 5,
    fontSize: 16,
    color: theme.surfacePrimary,
  },
  selectpic: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    "& img": {
      width: "100%",
      borderRadius: "50%",
    },
  },
  descripet: {
    background: theme.primaryBackground,
    borderRadius: 16,
    padding: "10px 16px 16px 16px",
    margin: "40px 0",
  },
  descripetItem: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 6,
  },
  leftTitle: {
    color: theme.secondBrand,
    fontSize: 13,
  },
  rightContent: {
    display: "flex",
    alignItems: "center",
    color: theme.surfacePrimary,
    fontSize: 13,
    fontWeight: 400,
  },
  desImg: {
    width: 14,
    marginLeft: 6,
  },
  note: {
    color: theme.primaryBrand,
  },
  noteview: {
    color: theme.primaryBrand,
    textAlign: "center",
    margin: "18px 0",
    cursor: "pointer",
  },
  err: {
    width: "100%",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    // minHeight: 80,
  },
  errInner: {
    //   fontSize: theme.transferFontM,
    color: "#fc5656",
    // width: "98%",
    // height: 41,
    textAlign: "center",
    marginTop: 15,
    background: "#fff",
    borderRadius: 12,
    padding: "8px 12px",
  },
  errInnerbody: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errnote: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: theme.infoDanger,
  },
  errnoteimg: {
    color: theme.infoDanger,
  },
  errMessage: {
    width: "100vw",
    position: "fixed",
    top: 122,
    left: 0,
    textAlign: "center",
  },
  errMessageMobile: {
    width: "calc(100vw - 32px)",
    position: "relative",
    top: -45,
    left: 0,
    textAlign: "center",
  },
  messageBody: {
    fontSize: 16,
    padding: "8px 15px",
    background: "#fff",
    //   width: theme.tipsWidth,
    borderRadius: 12,
    margin: "0 auto",
    // textAlign: "left",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greenText: {
    color: theme.infoSuccess,
  },
  unlockModal: {
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
        minHeight: 260,
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
}));
let detailInter;
export interface LockLiquidityModalProps {
  showModal: boolean;
  unlockableReward?: Array<Reward>;
  claimableReward?: Array<Reward>;
  claimRewardStatus?: ClaimType;
  onClose: () => void;
  claimMethod: () => void;
  loading: boolean;
  txHash: string;
}
export default function LockLiquidityModal({
  unlockableReward,
  claimableReward,
  claimRewardStatus,
  onClose,
  claimMethod,
  loading,
  txHash,
}: LockLiquidityModalProps): JSX.Element {
  const classes = useStyles();
  const { asset, transferInfo } = useAppSelector(state => state);
  const { windowWidth } = useAppSelector(state => state);
  const { chainId } = useWeb3Context();
  const dispatch = useAppDispatch();
  const { isMobile } = windowWidth;
  const { fromChainId } = asset;
  const { transferConfig } = transferInfo;
  const { chains } = transferConfig;
  const { themeType } = useContext(ColorThemeContext);
  const closeModal = () => {
    clearInterval(detailInter);
    onClose();
  };

  const getNetworkName = () => {
    if (Number(process.env.REACT_APP_CLAIM_ID) === 5) {
      return "Goerli Testnet";
    } else {
      return "Ethereum Mainnet";
    }
  };

  let content;
  let titleText = "Remove Liquidity";
  const buttonType: ButtonType = "primary";

  if (claimRewardStatus === ClaimType.SWITCH_CHAIN) {
    content = (
      <div>
        <div style={{ textAlign: "center" }}>
          <WarningFilled style={{ fontSize: 50, color: "#ffaa00", marginTop: 40 }} />
        </div>
        <div className={classes.modaldes}>
          Please switch to <div className={classes.yellowText}>{getNetworkName()} </div> before you can claim the
          rewards.
        </div>
        <Button
          type={buttonType}
          size="large"
          block
          loading={loading}
          onClick={() => {
            if (!isMobile) {
              switchChain(Number(process.env.REACT_APP_CLAIM_ID), "", (chainId: number) => {
                const chain = transferConfig.chains.find(chainInfo => {
                  return chainInfo.id === chainId;
                });
                if (chain !== undefined) {
                  dispatch(setFromChain(chain));
                }
              });
            } else {
              closeModal();
            }
          }}
          className={classes.button}
        >
          OK
        </Button>
      </div>
    );
    titleText = " ";
  } else if (claimRewardStatus === ClaimType.COMPLETED) {
    // Relay - check your fund
    content = (
      <div>
        <div className={classes.modalTopIcon} style={{ marginTop: 0 }}>
          <CheckCircleFilled
            style={{ fontSize: 70, fontWeight: "bold", color: themeType === "dark" ? "#00E096" : "#00B42A" }}
          />
        </div>
        <div className={classes.modaldes}>
          Successfully claim your retention reward. You should receive X CELR in a few minutes .
        </div>
        <div className={classes.noteview}>
          <a href={formatBlockExplorerUrlWithTxHash({ chainId, txHash })} target="_blank" rel="noreferrer">
            View in Explorer
          </a>
        </div>

        <Button
          type={buttonType}
          size="large"
          block
          loading={loading}
          onClick={() => {
            closeModal();
          }}
          className={classes.button}
        >
          OK
        </Button>
      </div>
    );
    titleText = "Retention Rewards";
  }

  return (
    <Modal title={titleText} width={512} onCancel={closeModal} visible footer={null} className={classes.unlockModal}>
      {content}
    </Modal>
  );
}
