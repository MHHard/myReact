import { useState, useEffect } from "react";
import { Button, Tooltip, Slider } from "antd";
import { createUseStyles } from "react-jss";
import { base64 } from "ethers/lib/utils";
import { InfoCircleOutlined } from "@ant-design/icons";
import { BigNumber } from "@ethersproject/bignumber";
import { formatDecimal } from "celer-web-utils/lib/format";
import { Provider, JsonRpcProvider } from "@ethersproject/providers";
import { IncentiveEventsRewardNew__factory } from "../../typechain/events-typechain/factories/IncentiveEventsRewardNew__factory";
import { Theme } from "../../theme";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { ClaimType } from "../../constants/type";
import SwitchChainModal from "./SwitchChainModal";
import ClaimSuccessModal from "./ClaimSuccessModal";
import { formatTimeCountDown } from "../../utils/timeFormat";
import { useAppSelector } from "../../redux/store";
import learnMoreImage from "../../images/learnMoreIcon.png";
import bscCampaignIconImage from "../../images/bscCampaignIcon.png";
import {
  BscCampaignInfo,
  ClaimGetBscCampaignRewardRequest,
  ClaimGetBscCampaignRewardResponse,
} from "../../proto/gateway/gateway_pb";
import { claimGetBscCampaignReward } from "../../redux/gatewayCbridge";
import { IncentiveEventsRewardNew } from "../../typechain/events-typechain/IncentiveEventsRewardNew";
import { ensureSigner } from "../../hooks/contractLoader";
import { useReadOnlyCustomContractLoader } from "../../hooks";
import { useConfigContext } from "../../providers/ConfigContextProvider";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  liquidityContent: {
    width: "100%",
    margin: "0 auto",
    position: "relative",
    lineHeight: 1,
    marginTop: "20px",
    marginBottom: 0,
    background: theme.secondBackground,
    padding: props => (props.isMobile ? "0 0 0 0 " : "0 16px 0 16px"),
    borderRadius: props => (props.isMobile ? 0 : 16),
    border: props => (props.isMobile ? "none" : `1px solid ${theme.primaryBorder}`),
  },
  liquidityInfo: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    "& :first": {
      marginRight: 18,
    },
  },
  mobileLiquidityInfo: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 30,
    "& :first": {
      marginRight: 18,
    },
  },
  liquidityInfoCol: {
    height: 142,
    flex: 1,
    marginLeft: 15,
    padding: "35px 24px",
    borderRadius: 16,
    background: theme.primaryBackground,
  },
  mobileLiquidityInfoCol: {
    height: 118,
    marginTop: 10,
    padding: "30px 15px 0px 15px",
    borderRadius: 16,
    background: theme.primaryBackground,
  },
  mobileTimeLiquidityInfoCol: {
    marginTop: 10,
    padding: "30px 15px 30px 15px",
    borderRadius: 16,
    background: theme.primaryBackground,
  },
  statTitle: {
    color: theme.secondBrand,
    fontSize: props => (props.isMobile ? 12 : 14),
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
  },
  statNum: {
    color: theme.surfacePrimary,
    fontWeight: 700,
    fontSize: 22,
    marginTop: 10,
  },
  claimBtn: {
    background: theme.primaryBrand,
    color: theme.unityWhite,
    border: 0,
    width: "107px",
    borderRadius: 6,
    fontSize: 16,
    marginTop: 10,
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
  header: {
    fontSize: 12,
    fontWeight: 400,
    color: theme.secondBrand,
    marginTop: 0,
    marginBottom: props => (props.isMobile ? 0 : 0),
    display: "flex",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: theme.surfacePrimary,
    marginTop: props => (props.isMobile ? 0 : 28),
  },
  titleDesc: {
    fontSize: 12,
    fontWeight: 400,
    lineHeight: props => (props.isMobile ? "14px" : "20px"),
    color: theme.secondBrand,
    marginTop: 10,
    marginBottom: 0,
  },
  titleUl: {
    marginBlockStart: "0px",
    marginBlockEnd: "0px",
    paddingInlineStart: "20px",
  },
  bannerImage: {
    width: props => (props.isMobile ? 156 : 372),
    height: props => (props.isMobile ? 52 : 124),
    marginTop: props => (props.isMobile ? 30 : 0),
  },
  statNumDes: {
    fontSize: 14,
    fontWeight: 500,
    marginTop: 3,
    color: theme.secondBrand,
  },
  statTitleBot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  silder: {
    marginLeft: 0,
    "&:hover": {
      "& .ant-slider-rail": {
        background: `${theme.primaryUnable} !important`,
      },
      "& .ant-slider-track": {
        background: `${theme.sliderTrack} !important`,
      },
    },
    "& .ant-slider-rail": {
      // 背景条
      height: 11,
      background: theme.primaryUnable,
      borderRadius: "100px",
    },
    "& .ant-slider-step": {
      height: 11,
    },
    "& .ant-slider-track": {
      // 活动条
      height: 11,
      background: theme.sliderTrack,
      borderRadius: "100px",
    },
    "& .ant-slider-dot": {
      display: "none",
    },
    "& .ant-slider-handle": {
      top: 9,
      display: "none",
    },
    "& .ant-slider-mark-text": {
      color: theme.secondBrand,
    },
  },
  claimMilestonDes1: {
    fontSize: 14,
    fontWeight: 500,
    marginTop: 10,
    color: theme.surfacePrimary,
    display: "flex",
    justifyContent: "space-between",
  },
  claimMilestonDes2: {
    color: theme.secondBrand,
    fontSize: 12,
    fontWeight: 500,
    marginTop: 5,
    display: "flex",
    alignItems: "center",
  },
  silderDesc: {
    paddingTop: 3,
    fontSize: 12,
    fontWeight: 400,
    textAlign: "right",
  },
  titleDescBlue: {
    color: theme.primaryBrand,
  },
  timeDes: {
    fontSize: 14,
    fontWeight: 400,
    marginTop: 10,
    color: theme.surfacePrimary,
  },
}));

interface BSCCampaignProps {
  bscCampaignInfo: BscCampaignInfo.AsObject;
  refreshBscCampaign: () => void;
}

export default function BSCCampaign(props: BSCCampaignProps): JSX.Element | null {
  let leftInterval;
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const { bscCampaignInfo, refreshBscCampaign } = props;
  const classes = useStyles({ isMobile });
  // const {
  //   contracts: { incentiveEventsRewardNew },
  // } = useContractsContext();
  const { provider, address, chainId } = useWeb3Context();
  const { getRpcUrlByChainId } = useConfigContext();
  const [incentiveEventsRewardNew, setIncentiveEventsRewardNew] = useState<IncentiveEventsRewardNew>();
  const [switchChainModalState, setSwitchChainModalState] = useState(false);
  const [claimSuccessModalState, setClaimSuccessModalState] = useState(false);
  const [claimRewardStatus, setClaimRewardStatus] = useState<ClaimType>();
  const [leftTimes, setLeftTimes] = useState<number>(0);
  const [claimTxHash, setClaimTxHash] = useState<string>("");
  const rpcUrl = getRpcUrlByChainId(process.env.REACT_APP_BSC_ID);
  const jprovider = new JsonRpcProvider(rpcUrl);
  const dstBridge = useReadOnlyCustomContractLoader(
    jprovider,
    bscCampaignInfo.eventConfig?.rewardContractAddr ?? "",
    IncentiveEventsRewardNew__factory,
  );

  useEffect(() => {
    if (!address) {
      return;
    }
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, incentiveEventsRewardNew]);

  useEffect(() => {
    if (dstBridge) {
      initData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dstBridge]);

  useEffect(() => {
    if (provider) {
      contractLoader();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const contractLoader = async () => {
    const signer = await ensureSigner(provider as Provider);
    if (signer) {
      const newContract = new IncentiveEventsRewardNew__factory(signer).attach(
        bscCampaignInfo.eventConfig?.rewardContractAddr ?? "",
      );
      setIncentiveEventsRewardNew(newContract);
    }
  };

  const initData = () => {
    if (bscCampaignInfo.signature?.sigBytes) {
      claimedRewardAmountsData(bscCampaignInfo.eventConfig?.eventId);
    } else {
      startCountDown();
    }
  };

  const claimedRewardAmountsData = async eventID => {
    try {
      // const farmTx = await incentiveEventsRewardNew?.claimedRewardAmounts(
      //   eventID,
      //   address,
      //   bscCampaignInfo.eventConfig?.wbnbAddr ?? "",
      // );
      const farmTx = await dstBridge?.claimedRewardAmounts(
        eventID,
        address,
        bscCampaignInfo.eventConfig?.wbnbAddr ?? "",
      );
      startCountDown();
      if (farmTx && BigNumber.from(farmTx).gte(BigNumber.from(bscCampaignInfo.eventConfig?.maxReward))) {
        setClaimRewardStatus(ClaimType.COMPLETED);
      }
    } catch (e) {
      startCountDown();
      console.log(e);
    }
  };

  const claimMethod = async () => {
    if (chainId !== Number(process.env.REACT_APP_BSC_ID)) {
      setSwitchChainModalState(true);
      return;
    }
    if (!incentiveEventsRewardNew) {
      return;
    }
    setClaimRewardStatus(ClaimType.CLAIMING);
    const req: ClaimGetBscCampaignRewardRequest = new ClaimGetBscCampaignRewardRequest();
    req.setAddr(address);
    req.setEventId(bscCampaignInfo.eventConfig?.eventId ?? 0);

    const res: ClaimGetBscCampaignRewardResponse = await claimGetBscCampaignReward(req);
    const resObj = res.toObject();
    console.debug(resObj);
    if (!resObj.err) {
      const signatures = resObj.signature;
      const sigs = base64.decode(signatures ? (signatures?.sigBytes as string) : "");
      try {
        const claimTx = (
          await incentiveEventsRewardNew.claimReward(
            address,
            resObj.eventId,
            [bscCampaignInfo.eventConfig?.wbnbAddr ?? ""],
            [resObj.currentReward],
            sigs,
          )
        ).hash;
        console.debug(claimTx);
        setClaimTxHash(claimTx);
        setClaimRewardStatus(ClaimType.COMPLETED);
        setClaimSuccessModalState(true);
        refreshBscCampaign();
      } catch (e) {
        console.log(e);
        setClaimRewardStatus(ClaimType.UNLOCK_SUCCESSED);
      }
    } else {
      setClaimRewardStatus(ClaimType.UNLOCK_SUCCESSED);
    }
  };

  const startCountDown = () => {
    clearInterval(leftInterval);
    if (claimRewardStatus === ClaimType.COMPLETED) {
      return;
    }

    const endTime = bscCampaignInfo.eventConfig?.eventEndTime || 0;
    let leftT = (endTime - new Date().getTime()) / 1000;
    if ((bscCampaignInfo.eventConfig?.soFarSumReward || 0) >= (bscCampaignInfo.eventConfig?.eventMaxRewardCap || 0)) {
      leftT = 0;
    }
    if (leftT > 0) {
      setClaimRewardStatus(ClaimType.UNLOCKED_TOO_FREQUENTLY);
    } else {
      if (bscCampaignInfo.currentTransferVolume >= (bscCampaignInfo.eventConfig?.maxTransferVolume ?? 0)) {
        setClaimRewardStatus(ClaimType.UNLOCK_SUCCESSED);
      }
      return;
    }
    setLeftTimes(leftT);
    leftInterval = setInterval(() => {
      if (leftT <= 0) {
        clearInterval(leftInterval);
        setClaimRewardStatus(ClaimType.UNLOCK_SUCCESSED);
      } else {
        leftT -= 1;
      }
      setLeftTimes(leftT);
    }, 1000);
  };

  let curReward = "0";
  if (bscCampaignInfo.currentTransferVolume >= (bscCampaignInfo.eventConfig?.maxTransferVolume ?? 0)) {
    curReward = formatDecimal(bscCampaignInfo.eventConfig?.maxReward ?? "0", 2);
  }
  let curTransferVolume = bscCampaignInfo.currentTransferVolume;
  const maxTransferVolume = bscCampaignInfo.eventConfig?.maxTransferVolume ?? 0;
  if (curTransferVolume > maxTransferVolume) {
    curTransferVolume = maxTransferVolume;
  }
  const sliderValue = (curTransferVolume / maxTransferVolume) * 100;

  const renderBtn = () => {
    switch (claimRewardStatus) {
      case ClaimType.UNLOCK_SUCCESSED:
        return (
          <Button type="primary" className={classes.claimBtn} onClick={claimMethod}>
            Claim
          </Button>
        );
      case ClaimType.CLAIMING:
        return (
          <Button type="primary" className={classes.claimBtn} disabled>
            Claiming
          </Button>
        );
      case ClaimType.COMPLETED:
        return (
          <Button type="primary" className={classes.claimBtn} disabled>
            Claimed
          </Button>
        );
      default:
        return (
          <Button type="primary" className={classes.claimBtn} disabled>
            Claim
          </Button>
        );
    }
  };

  const learnMore = () => {
    return (
      <a href={bscCampaignInfo.eventConfig?.eventFaqLinkUrl} target="_blank" rel="noreferrer">
        {" Learn More "}
      </a>
    );
  };

  const liquidityInfoPanel = () => (
    <div>
      <div>
        <div className={classes.header}>
          <div>
            <div className={classes.title}>{bscCampaignInfo.eventConfig?.eventTitle}</div>
            <div className={classes.titleDesc}>
              <ul className={classes.titleUl}>
                <li>
                  {bscCampaignInfo.eventConfig?.eventDescription} <span>{learnMore()}</span>
                </li>
                <li>
                  Current distributed rewards: {bscCampaignInfo.eventConfig?.soFarSumReward.toFixed(0)}/
                  {bscCampaignInfo.eventConfig?.eventMaxRewardCap.toFixed(0)} WBNB{" "}
                  <img src={bscCampaignIconImage} alt="LAYER2.FINANCE" style={{ width: "15px", marginBottom: "1px" }} />
                </li>
              </ul>
            </div>
          </div>
          <img className={classes.bannerImage} src={bscCampaignInfo.eventConfig?.eventPromoImgUrl} alt="" />
        </div>

        <div className={isMobile ? classes.mobileLiquidityInfo : classes.liquidityInfo}>
          <div
            className={isMobile ? classes.mobileTimeLiquidityInfoCol : classes.liquidityInfoCol}
            style={{ marginLeft: 0 }}
          >
            <div className={classes.statTitle}>Event Ends in:</div>
            <div className={classes.statNum}>
              <span>{leftTimes > 0 ? formatTimeCountDown(leftTimes) : "This event has ended"}</span>
            </div>
            {leftTimes > 0 && (
              <div className={classes.timeDes}>
                or when the max reward cap is reached{" "}
                <span>
                  <span>
                    <div
                      onClick={() => {
                        window.open(bscCampaignInfo.eventConfig?.eventFaqLinkUrl);
                      }}
                      style={{ cursor: "pointer", display: "inline-block" }}
                    >
                      <img src={learnMoreImage} alt="LAYER2.FINANCE" style={{ width: "20px" }} />
                    </div>
                  </span>
                </span>
              </div>
            )}
          </div>
          <div className={isMobile ? classes.mobileLiquidityInfoCol : classes.liquidityInfoCol}>
            <div className={classes.statTitle}>
              Your Total Rewards
              <Tooltip
                placement="top"
                title={<div>{bscCampaignInfo.eventConfig?.eventRewardsTooltip}</div>}
                overlayInnerStyle={{
                  width: 265,
                  color: "#0A1E42",
                  padding: "9px 12px",
                  fontSize: "12px",
                  textAlign: "left",
                }}
                color="#FFFFFF"
              >
                <InfoCircleOutlined style={{ fontSize: 15, marginLeft: 5 }} />
              </Tooltip>
            </div>
            <div className={classes.statTitleBot}>
              <div>
                <div className={classes.statNum}>{curReward} WBNB</div>
              </div>
              {renderBtn()}
            </div>
          </div>
          <div className={isMobile ? classes.mobileTimeLiquidityInfoCol : classes.liquidityInfoCol}>
            <div className={classes.statTitle}>
              Claim Milestone
              <Tooltip
                placement="top"
                title={
                  <div>
                    You can make progress towards your claim milestone by making qualified cross-chain transfers in
                    cBridge. {learnMore()} about qualified transfers.
                  </div>
                }
                overlayInnerStyle={{
                  width: 265,
                  color: "#0A1E42",
                  padding: "9px 12px",
                  fontSize: "12px",
                  textAlign: "left",
                }}
                color="#FFFFFF"
              >
                <InfoCircleOutlined style={{ fontSize: 15, marginLeft: 5 }} />
              </Tooltip>
            </div>
            <Slider className={classes.silder} step={1} value={sliderValue} />
            <div className={classes.claimMilestonDes1}>
              <div>Transfer volume required</div>
              <div className={classes.silderDesc}>
                ${curTransferVolume.toFixed(2)}/$
                {maxTransferVolume.toFixed(0)}
              </div>
            </div>
            <div className={classes.claimMilestonDes2}>
              {learnMore()}
              <span style={{ marginLeft: 5 }}>about qualified transfers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={classes.liquidityContent}>
      {liquidityInfoPanel()}

      {switchChainModalState && (
        <SwitchChainModal
          showModal={switchChainModalState}
          claimTitle="rewards"
          onClose={() => {
            refreshBscCampaign();
            setSwitchChainModalState(false);
          }}
        />
      )}

      {claimSuccessModalState && (
        <ClaimSuccessModal
          modaldes="Your request to claim the rewards has been submitted"
          txHash={claimTxHash}
          onClose={() => {
            refreshBscCampaign();
            setClaimSuccessModalState(false);
          }}
        />
      )}
    </div>
  );
}
