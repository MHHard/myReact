import { Button, Modal } from "antd";
import { ButtonType } from "antd/lib/button";
import { createUseStyles } from "react-jss";
import { LoadingOutlined, WarningFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getNetworkById } from "../../constants/network";
import { UnlockRewardType, Reward } from "../../constants/type";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { switchChain, setFromChain } from "../../redux/transferSlice";
import { Theme } from "../../theme";
import { getTokenSymbol } from "../../redux/assetSlice";
import unlockSuccessIcon from "../../images/unlockSuccess.svg";

/* eslint-disable */

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

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
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
    marginBottom: props => (props.isMobile ? 0 : 45),
    color: theme.transferSuccess,
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
    marginTop: props => (props.isMobile ? 16 : 40),
    height: 56,
    lineHeight: "42px",
    background: theme.primaryBrand,
    borderRadius: 16,
    border: "none",
    fontSize: 16,
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
    marginTop: props => (props.isMobile ? 15 : 40),
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
    fontSize: 22,
    fontWeight: 700,
  },
  unlockModal: {
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
        minHeight: 260,
        padding: props => (props.isMobile ? "16px" : ""),
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

/* eslint-disable */

export interface LockLiquidityModalProps {
  showModal: boolean;
  unlockableReward?: Array<Reward>;
  claimableReward?: Array<Reward>;
  claimRewardStatus?: UnlockRewardType;
  claimChainId: number;
  onClose: () => void;
  onSuccessClose: () => void;
  txHash: string;
}
export default function LockLiquidityModal({
  unlockableReward,
  claimableReward,
  claimRewardStatus,
  claimChainId,
  onClose,
}: LockLiquidityModalProps): JSX.Element {
  const { windowWidth } = useAppSelector(state => state);
  const { isMobile } = windowWidth;
  const classes = useStyles({ isMobile });
  const { transferInfo } = useAppSelector(state => state);
  const { chainId } = useWeb3Context();
  const dispatch = useAppDispatch();
  const { transferConfig } = transferInfo;
  const [unlockableChains, setUnlockableChains] = useState<Array<number>>([]);
  const [claimableTokenSymbols, setClaimableTokenSymbols] = useState<Array<string>>([]);
  const closeModal = () => {
    clearInterval(detailInter);
    onClose();
  };

  useEffect(() => {
    if (unlockableReward) {
      const tempChainIds = new Set<number>();
      unlockableReward.forEach(map => {
        tempChainIds.add(map.chain_id);
      });
      setUnlockableChains(Array.from(tempChainIds));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockableReward]);

  useEffect(() => {
    const tempSymbols = new Set<string>();
    if (unlockableReward) {
      unlockableReward.forEach(map => {
        tempSymbols.add(map.token.symbol);
      });
    }
    if (claimableReward) {
      claimableReward.forEach(map => {
        tempSymbols.add(map.token.symbol);
      });
    }
    setClaimableTokenSymbols(Array.from(tempSymbols));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockableReward, claimableReward]);

  let content;
  let titleText = "Remove Liquidity";
  const buttonType: ButtonType = "primary";

  if (claimRewardStatus === UnlockRewardType.SWITCH_CHAIN) {
    content = (
      <div>
        <div style={{ textAlign: "center" }}>
          <WarningFilled style={{ fontSize: 50, color: "#ffaa00", marginTop: 40 }} />
        </div>
        <div className={classes.modaldes}>
          {/* <div>Farming rewards can only be viewed and claimed on {getNetworkById(claimChainId).name}.</div> */}
          Please switch to <div className={classes.yellowText}>{getNetworkById(claimChainId).name} </div> before you can
          claim the rewards.
        </div>
        <Button
          type={buttonType}
          size="large"
          block
          onClick={() => {
            if (!isMobile) {
              switchChain(claimChainId, "", (targetFromChainId: number) => {
                const chain = transferConfig.chains.find(chainInfo => {
                  return chainInfo.id === targetFromChainId;
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
  } else if (claimRewardStatus === UnlockRewardType.UNLOCKED_TOO_FREQUENTLY) {
    content = (
      <div>
        <div style={{ textAlign: "center" }}>
          <WarningFilled style={{ fontSize: 50, color: "#ffaa00", marginTop: 40 }} />
        </div>
        <div className={classes.modaldes}>Unlock too frequently. Please try again in a few minutes.</div>
        <Button
          type={buttonType}
          size="large"
          block
          onClick={() => {
            closeModal();
          }}
          className={classes.button}
        >
          OK
        </Button>
      </div>
    );
    titleText = " ";
  } else if (claimRewardStatus === UnlockRewardType.UNLOCKING) {
    // transferring
    content = (
      <>
        <div className={classes.modalTop}>
          <div className={classes.modalTopIcon}>
            <LoadingOutlined style={{ fontSize: 50, fontWeight: "bold", color: "#1890ff" }} />
          </div>
        </div>
        <div className={classes.modaldes}>
          Your farming rewards are being unlocked on Celer State Guardian Network (SGN), which may take a few minutes
        </div>

        {unlockableChains.map(chain_id => {
          return (
            <div className={classes.detailItem}>
              <div className={classes.itemLeft}>
                <div>
                  <img className={classes.itemContImg} src={getNetworkById(chain_id).iconUrl} alt="" />
                </div>
                <div className={classes.itemText}>
                  <div className={classes.itemTitle}>{getNetworkById(chain_id).name}</div>
                </div>
              </div>
              <div className={classes.itemRight}>
                <div className={classes.fromNet}>Reward Amount</div>
                {unlockableReward?.map(item => {
                  return item.chain_id === chain_id ? (
                    <div className={classes.totalValueRN}>
                      + {`${item?.amt?.toFixed(2)} ${getTokenSymbol(item?.token?.symbol, chain_id)}`}
                    </div>
                  ) : (
                    ""
                  );
                })}
              </div>
            </div>
          );
        })}
      </>
    );
    titleText = " ";
  } else if (claimRewardStatus === UnlockRewardType.UNLOCK_SUCCESSED) {
    // transferring
    content = (
      <>
        <div className={classes.modalTop}>
          <div className={classes.modalTopIcon}>
            <img src={unlockSuccessIcon} alt="unlock success" />
          </div>
          <div className={classes.modaldes2}>
            <span className={classes.greenText}>Rewards unlocked successfully</span>
          </div>
        </div>
        <div className={classes.modaldes}>
          Click the button to claim your{" "}
          {claimableTokenSymbols?.map((symbol, index) => {
            let claimableAmt = 0;
            unlockableReward?.forEach(map => {
              if (map.token.symbol === symbol) {
                claimableAmt += map.amt;
              }
            });

            claimableReward?.forEach(map => {
              if (map.token.symbol === symbol) {
                claimableAmt += map.amt;
              }
            });
            const unlockItem = unlockableReward?.find(it => it.token.symbol === symbol);
            const claimableItem = claimableReward?.find(it => it.token.symbol === symbol);
            const tokenSymbol = unlockItem
              ? getTokenSymbol(unlockItem?.token?.symbol, unlockItem?.chain_id)
              : getTokenSymbol(claimableItem?.token?.symbol, claimableItem?.chain_id);

            return index === 0 ? (
              <span className={classes.greenText} style={{ fontSize: 14, fontWeight: 600 }}>
                {claimableAmt.toFixed(2)} <span>{tokenSymbol}</span>
              </span>
            ) : (
              <span className={classes.greenText} style={{ fontSize: 14, fontWeight: 600 }}>
                {" "}
                + {claimableAmt.toFixed(2)} <span>{tokenSymbol}</span>
              </span>
            );
          })}{" "}
          rewards.
        </div>
        <Button
          type={buttonType}
          size="large"
          block
          onClick={() => {
            closeModal();
          }}
          className={classes.button}
        >
          Claim Farming Rewards
        </Button>
      </>
    );
    titleText = " ";
  }

  return (
    <Modal title={titleText} width={512} onCancel={closeModal} visible footer={null} className={classes.unlockModal}>
      {content}
    </Modal>
  );
}
