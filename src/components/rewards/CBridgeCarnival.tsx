import { useState, useEffect } from "react";
import { Button } from "antd";
import { createUseStyles } from "react-jss";
// import { InfoCircleOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { Theme } from "../../theme";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { formatTimeCountDown } from "../../utils/timeFormat";
import { useAppSelector } from "../../redux/store";
import bannerCBridgeCarnival from "../../images/bannerCBridgeCarnival.png";
// import learnMoreImage from "../../images/learnMoreIcon.png";
// import {
//   InIncentiveCampaignBnbWhiteListRequest,
//   InIncentiveCampaignBnbWhiteListResponse,
// } from "../../proto/gateway/gateway_pb";
// import { getBNBIncentiveCampaignBNBWhiteInfo } from "../../redux/gatewayCbridge";

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
    padding: "30px 15px 20px 15px",
    borderRadius: 16,
    background: theme.primaryBackground,
  },
  mobileTimeLiquidityInfoCol: {
    marginTop: 10,
    padding: "30px 15px 30px 15px",
    borderRadius: 16,
    background: theme.primaryBackground,
  },
  countDown: {
    width: "33%",
  },
  rebateReward: {
    width: "67%",
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
    width: "165px",
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
  statNumNotEligible: {
    color: theme.secondBrand,
    fontWeight: 700,
    fontSize: 22,
    marginTop: 10,
  },
  desEligible: {
    color: "#00E096",
    fontWeight: 400,
    fontSize: 14,
    marginTop: 10,
    marginLeft: 4,
  },
  desNotEligible: {
    color: "#FF3D71",
    fontWeight: 400,
    fontSize: 14,
    marginTop: 10,
    marginLeft: 4,
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
    marginLeft: 6,
  },
  statTitleBot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeDes: {
    fontSize: 14,
    fontWeight: 400,
    marginTop: 10,
    color: theme.surfacePrimary,
  },
}));

let leftInterval;
export default function CBridgeCarnival(): JSX.Element | null {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const { address } = useWeb3Context();
  const endDate = new Date("2022-01-26 18:00:00");
  const endTimes = (endDate.getTime() - new Date().getTime()) / 1000;
  const [leftTimes, setLeftTimes] = useState<number>(endTimes);
  // const [bnbEligible, setBNBEligible] = useState<boolean>(false);

  useEffect(() => {
    startCountDown();
    // getBNBIncentiveCampaignBNBInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  // const getBNBIncentiveCampaignBNBInfo = async () => {
  //   if (!address) {
  //     return;
  //   }

  //   const req = new InIncentiveCampaignBnbWhiteListRequest();
  //   req.setAddr(address);
  //   const res: InIncentiveCampaignBnbWhiteListResponse = await getBNBIncentiveCampaignBNBWhiteInfo(req);
  //   const resObj = res.toObject();
  //   console.log(resObj);

  //   if (!resObj.err) {
  //     setBNBEligible(resObj.eligible);
  //   }
  // };

  const startCountDown = () => {
    clearInterval(leftInterval);
    if (leftTimes <= 0) {
      return;
    }
    let leftT = leftTimes;

    leftInterval = setInterval(() => {
      if (leftT <= 0) {
        clearInterval(leftInterval);
      } else {
        leftT -= 1;
      }
      setLeftTimes(leftT);
    }, 1000);
  };

  const learnMore = () => {
    return (
      <a href="https://cbridge-docs.celer.network/rewards/fee-rebate" target="_blank" rel="noreferrer">
        {" View Detailed Rules"}
      </a>
    );
  };

  const liquidityInfoPanel = () => (
    <div>
      <div className={classes.header}>
        <div>
          <div className={classes.title}>cBridge Carnival</div>
          <div className={classes.titleDesc}>
            {" "}
            {leftTimes > 0
              ? "Earn BUSD rewards by making USDT/USDC/ETH cross-chain transfers! "
              : "Bridge Carnival has ended. BUSD rewards will be sent to the winners within 7 days."}
            <span>{learnMore()}</span>
          </div>
        </div>
        <img className={classes.bannerImage} src={bannerCBridgeCarnival} alt="banner fee rebate" />
      </div>
      <div className={isMobile ? classes.mobileLiquidityInfo : classes.liquidityInfo}>
        <div
          className={
            isMobile ? classes.mobileTimeLiquidityInfoCol : classNames(classes.liquidityInfoCol, classes.countDown)
          }
          style={{ marginLeft: 0 }}
        >
          <div className={classes.statTitle}>Event Ends in:</div>
          <div className={classes.statTitleBot}>
            <div className={classes.statNum}>
              <span>{leftTimes > 0 ? formatTimeCountDown(leftTimes) : "This event has ended"}</span>
            </div>
            <Button
              type="primary"
              className={classes.claimBtn}
              onClick={() => {
                window.open("https://cbridge-carnival-leaderboard.netlify.app/?index=0");
              }}
            >
              View leaderboard
            </Button>
          </div>
        </div>

        {/* <div
          className={
            isMobile ? classes.mobileLiquidityInfoCol : classNames(classes.liquidityInfoCol, classes.rebateReward)
          }
        >
          <div className={classes.statTitleBot}>
            <div>
              <div className={classes.statNum}>
                CELR Carnival {leftTimes > 0 && <span className={classes.desEligible}>Eligible</span>}
              </div>
            </div>
          </div>

          <div className={classes.timeDes}>
            <a href="https://cbridge-carnival-leaderboard.netlify.app/?index=0" target="_blank" rel="noreferrer">
              View CELR rewards leaderboard <img src={learnMoreImage} alt="LAYER2.FINANCE" style={{ width: "20px" }} />
            </a>
          </div>
        </div>

        <div
          className={
            isMobile ? classes.mobileLiquidityInfoCol : classNames(classes.liquidityInfoCol, classes.rebateReward)
          }
        >
          <div className={classes.statTitleBot}>
            <div>
              {bnbEligible || leftTimes <= 0 ? (
                <div className={classes.statNum}>
                  BNB Carnival {leftTimes > 0 && <span className={classes.desEligible}>Eligible</span>}
                </div>
              ) : (
                <div className={classes.statNumNotEligible}>
                  BNB Carnival <span className={classes.desNotEligible}>Not Eligible</span>
                  <Tooltip
                    placement="top"
                    title={
                      <div>
                        {" "}
                        Whitelist required. Only users who traded over $50000 volume in PancakeSwap in December 2021 are
                        eligible for BNB rewards.
                      </div>
                    }
                    overlayInnerStyle={{
                      width: 260,
                      color: "#0A1E42",
                      padding: "9px 12px",
                      fontSize: "12px",
                      textAlign: "left",
                    }}
                    color="#FFFFFF"
                  >
                    <InfoCircleOutlined style={{ fontSize: 15, marginLeft: 5, color: "#FF3D71" }} />
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
          <div className={classes.timeDes}>
            <a href="https://cbridge-carnival-leaderboard.netlify.app/?index=1" target="_blank" rel="noreferrer">
              View BNB rewards leaderboard <img src={learnMoreImage} alt="LAYER2.FINANCE" style={{ width: "20px" }} />
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
  return <div className={classes.liquidityContent}>{liquidityInfoPanel()}</div>;
}
