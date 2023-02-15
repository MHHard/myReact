import { useState, useEffect, useMemo } from "react";
import { createUseStyles } from "react-jss";
import { Button } from "antd";
import { base64 } from "ethers/lib/utils";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useAppSelector } from "../../redux/store";
import { Theme } from "../../theme";
import { formatTimeCountDown } from "../../utils/timeFormat";
import { useContractsContext } from "../../providers/ContractsContextProvider";
import { ClaimType, GetPercentageFeeRebateInfoResponse } from "../../constants/type";
import SwitchChainModal from "./SwitchChainModal";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { getPercentageFeeRebateInfo } from "../../redux/gateway";
import ClaimSuccessModal from "./ClaimSuccessModal";
import bannerOpFeeRebate from '../../images/bannerOpFeeRebate.png';
import { formatDecimal } from "../../helpers/format";
import { useConfigContext } from "../../providers/ConfigContextProvider";
import { IncentiveEventsReward__factory } from "../../typechain/events-typechain";
import { useReadOnlyCustomContractLoader } from "../../hooks";
import { destinationRelayCheckerByTxHash } from "../../helpers/destinationRelayChecker";


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
      padding: '39px 24px 29px 24px',
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
    capTitle: {
      color: theme.surfacePrimary,
      fontWeight: 500,
      fontSize: 14,
      marginTop: 6,
    },
    claimBtn: {
      background: theme.primaryBrand,
      color: theme.unityWhite,
      border: 0,
      width: "107px",
      borderRadius: 6,
      fontSize: 16,
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
      marginBottom: 10,
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
      // alignItems: "center",
      justifyContent: "space-between",
    },
    timeDes: {
      fontSize: 14,
      fontWeight: 400,
      marginTop: 10,
      color: theme.surfacePrimary,
    },
  }));
  
interface OPFeeRebateProps {
    showOPFeeRabate: (show: boolean) => void;
    showLoading: (show: boolean) => void;
    loading: boolean;
}

export default function OPFeeRebate(props: OPFeeRebateProps): JSX.Element | null {
    let leftInterval;
    const { showOPFeeRabate, showLoading, loading } = props;
    const { isMobile } = useAppSelector(state => state.windowWidth);
    const classes = useStyles({ isMobile });
    const { getRpcUrlByChainId } = useConfigContext();
    const { address, chainId } = useWeb3Context();
    const [leftTimes, setLeftTimes] = useState<number>(0);
    const [claimRewardStatus, setClaimRewardStatus] = useState<ClaimType>();
    const [switchChainModalState, setSwitchChainModalState] = useState(false);
    const [claimSuccessModalState, setClaimSuccessModalState] = useState(false);
    const [claimTxHash, setClaimTxHash] = useState<string>("");
    // const [claimedRewards, setClaimedRewards] = useState<string>("0");
    const [claimableReward, setClaimableReward] = useState<string>("0");
    const [gloablmaxRewardCap, setGloablmaxRewardCap] = useState<string>("0");
    const [personalRewardCap, setPersonalRewardCap] = useState<string>("0");
    const [globalSoFarSumReward, setGlobalSoFarSumReward] = useState<string>("0");
    const [personalSoFarSumReward, setPersonalSoFarSumReward] = useState<string>("0");

    const [getPercentageFeeRebateInfoResponse, setGetPercentageFeeRebateInfoResponse] = useState<GetPercentageFeeRebateInfoResponse>();
    const rebateId = process.env.REACT_APP_ENV === "MAINNET" ? process.env.REACT_APP_OPTIMISM_ID : process.env.REACT_APP_BSC_ID;
    const rpcUrl = getRpcUrlByChainId(rebateId);
    const [globalCapReached, setGlobalCapReached] = useState(false);
    const [personalCapReached, setPersonalCapReached] = useState(false);
    const [countDownStoppedDes, setCountDownStoppedDes] = useState('');
    const [leftTimesDes, setLeftTimesDes] = useState('');

    const jprovider = useMemo(() => {
      if(rpcUrl) {
        return new JsonRpcProvider(rpcUrl)
      }
      return undefined
    }, [rpcUrl]);

    const {
      contracts: { incentiveEventsReward },
    } = useContractsContext();

    const dstBridge = useReadOnlyCustomContractLoader(
      jprovider,
      process.env.REACT_APP_INCENTIVE_REWARDS_ADDRESS ?? "",
      IncentiveEventsReward__factory,
    );
  

    useEffect(() => {
      if (!address) {
        return;
      }
      initData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    const initData = () => {
      getOpRewards();
    };

    const getOpRewards = () => {
      showLoading(true);
      getPercentageFeeRebateInfo({ addr: address })
        .then(res => {
          if (res && Number(res.event_id) > 10000) {
            setGetPercentageFeeRebateInfoResponse(res);
            const endTime = res?.event_end_time || 0;
            if ((res?.so_far_sum_reward || 0) >= (res?.event_max_reward_cap || 0)) {
              setLeftTimes(0);
            } else {
              const leftT = (endTime - new Date().getTime()) / 1000;
              setLeftTimes(leftT);
            }
            showOPFeeRabate(true);
            // showLoading(false);
          } else {
            showOPFeeRabate(false);
            showLoading(false);
          }
        })
        .catch(e => {
          showOPFeeRabate(false);
          showLoading(false);
          console.log(e);
        });
    }

    useEffect(() => {
      if (!getPercentageFeeRebateInfoResponse) {
        return;
      }
      setClaimableReward(getPercentageFeeRebateInfoResponse?.reward_amt.toFixed(2));
      setGloablmaxRewardCap(getPercentageFeeRebateInfoResponse?.event_max_reward_cap.toFixed(0));
      setPersonalRewardCap(getPercentageFeeRebateInfoResponse?.per_user_max_reward_cap.toFixed(0));
      setGlobalSoFarSumReward(getPercentageFeeRebateInfoResponse?.so_far_sum_reward.toFixed(2));

      claimedRewardAmountsData(getPercentageFeeRebateInfoResponse?.event_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getPercentageFeeRebateInfoResponse]);
    
    const claimedRewardAmountsData = async (eventID) => {
      try {
        const claimedRex = await dstBridge?.claimedRewardAmounts(eventID, address, process.env.REACT_APP_INCENTIVE_REWARDS_TOKEN_ADDRESS ?? '');
        const decimal = process.env.REACT_APP_ENV === "MAINNET" ? 18 : 18;
        const claimedNum = Number(formatDecimal(claimedRex, decimal)).toFixed(2);
        setPersonalSoFarSumReward(claimedNum);
        startCountDown(claimedNum);
        showLoading(false);
      } catch(e) {
        console.log(e);
        startCountDown();
        showLoading(false);
      }
    }

    const startCountDown = (claimedNum?: string) => {
      clearInterval(leftInterval);
      // if (claimRewardStatus === ClaimType.COMPLETED) {
      //   return;
      // }
  
      const endTime = getPercentageFeeRebateInfoResponse?.event_end_time || 0;
      let leftT = (endTime - new Date().getTime()) / 1000;

      const eventClaimedNum = ((getPercentageFeeRebateInfoResponse?.so_far_sum_reward || 0) + (getPercentageFeeRebateInfoResponse?.reward_amt || 0)).toFixed(2)
      const eventMaxRewardNum = (getPercentageFeeRebateInfoResponse?.event_max_reward_cap || 0).toFixed(2);

      if (Number(eventClaimedNum) >= Number(eventMaxRewardNum)) {
        setLeftTimes(0);
        setGlobalCapReached(true);
      }

      const perClaimedNum = ((Number(claimedNum) || 0) + (getPercentageFeeRebateInfoResponse?.reward_amt || 0)).toFixed(2)
      const perMaxClaimedNum = (getPercentageFeeRebateInfoResponse?.per_user_max_reward_cap || 0).toFixed(2);
      if (Number(perClaimedNum) >= Number(perMaxClaimedNum)) {
        setLeftTimes(0);
        setPersonalCapReached(true);
      }

      leftInterval = setInterval(() => {
        if (leftT <= 0) {
          clearInterval(leftInterval);
          // setClaimRewardStatus(ClaimType.COMPLETED);
        } else {

          leftT -= 1;
        }
        setLeftTimes(leftT);
      }, 1000);
    };

    useEffect(() => {
      if(globalCapReached || personalCapReached) {
        setClaimRewardStatus(ClaimType.COMPLETED);
      } 
      if(Number(claimableReward) > 0 && claimRewardStatus !== ClaimType.CLAIMING){
        setClaimRewardStatus(ClaimType.UNLOCK_SUCCESSED);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [claimableReward, globalCapReached, personalCapReached])

    useEffect(() => {
      if(loading) {
        setCountDownStoppedDes('');
        setLeftTimesDes(formatTimeCountDown(leftTimes))
      } else if (leftTimes <= 0) {
        setCountDownStoppedDes('');
        setLeftTimesDes('This event has ended');
      } else if (personalCapReached) {
        setCountDownStoppedDes('Your personal reward cap has been reached');
        setLeftTimesDes('This event has ended');
      } else if (globalCapReached) {
        setCountDownStoppedDes('Global reward cap has been reached');
        setLeftTimesDes('This event has ended');
      } else {
        setCountDownStoppedDes('');
        setLeftTimesDes(formatTimeCountDown(leftTimes));
      }
    }, [globalCapReached, personalCapReached, leftTimes, loading])


    const claimMethod = async () => {
        const id = process.env.REACT_APP_ENV === "MAINNET" ? process.env.REACT_APP_OPTIMISM_ID : process.env.REACT_APP_BSC_ID;
        if (chainId !== Number(id)) {
            setSwitchChainModalState(true);
            return;
        }
        if (!incentiveEventsReward) {
          return;
        }
        if (!getPercentageFeeRebateInfoResponse) {
          return;
        }
        setClaimRewardStatus(ClaimType.CLAIMING);

        const sigs = base64.decode(getPercentageFeeRebateInfoResponse.signature.sig_bytes);
        try {
         console.debug(`_recipient: ${address},
         _eventId:${getPercentageFeeRebateInfoResponse.event_id},
         _tokens: [${process.env.REACT_APP_INCENTIVE_REWARDS_TOKEN_ADDRESS}],
         _rewardAmounts: [${getPercentageFeeRebateInfoResponse.reward}]`)
         const gasLimit = await incentiveEventsReward.estimateGas.claimReward(
          address,
          `${getPercentageFeeRebateInfoResponse.event_id}`,
          [process.env.REACT_APP_INCENTIVE_REWARDS_TOKEN_ADDRESS ?? ''],
          [getPercentageFeeRebateInfoResponse.reward],
          sigs
          );
          const claimTx = (
            await incentiveEventsReward
            .claimReward(
              address,
              `${getPercentageFeeRebateInfoResponse.event_id}`,
              [process.env.REACT_APP_INCENTIVE_REWARDS_TOKEN_ADDRESS ?? ''],
              [getPercentageFeeRebateInfoResponse.reward],
              sigs,
              {gasLimit}
            )
          ).hash;
          setClaimTxHash(claimTx);
          setClaimRewardStatus(ClaimType.COMPLETED);
          setClaimSuccessModalState(true);
        } catch (e) {
          setClaimRewardStatus(ClaimType.UNLOCK_SUCCESSED);
        }
    }

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
                Claim
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
          <a href="https://cbridge-docs.celer.network/rewards/fee-rebate" target="_blank" rel="noreferrer">
            {" Learn More"}
          </a>
        );
    };

    const liquidityInfoPanel = () => (
        <div>
            <div className={classes.header}>
                <div>
                    <div className={classes.title}>OP Fee Rebate</div>
                    <div className={classes.titleDesc}>
                        {" "}
                        <ul className={classes.titleUl}>
                            <li>
                                During the event period, you will be able to receive a {(getPercentageFeeRebateInfoResponse?.rebate_portion || 0) * 100}% fee rebate for the transfers into Optimism.
                                <span>{learnMore()}</span>
                            </li>
                            <li>
                                Global rewards cap: <span style={{ color: globalCapReached ? '#00E096' : '#8F9BB3' }}>{globalCapReached ? gloablmaxRewardCap : Number(Number(globalSoFarSumReward) + Number(claimableReward)).toFixed(2)}/{gloablmaxRewardCap}</span> OP

                            </li>
                            <li>
                                Your personal rewards cap: <span style={{ color: personalCapReached ? '#00E096' : '#8F9BB3' }}>{personalCapReached ? personalRewardCap : Number(Number(personalSoFarSumReward) + Number(claimableReward)).toFixed(2)}/{personalRewardCap}</span> OP

                            </li>
                        </ul>
                    </div>
                </div>
                <img className={classes.bannerImage} src={bannerOpFeeRebate} alt="banner fee rebate" />
            </div>
            <div className={isMobile ? classes.mobileLiquidityInfo : classes.liquidityInfo}>
                <div
                    className={isMobile ? classes.mobileTimeLiquidityInfoCol : classes.liquidityInfoCol}
                    style={{ marginLeft: 0 }}
                >
                    <div className={classes.statTitle}>Event Ends in:</div>
                    <div className={classes.statNum}>
                        <span>{leftTimesDes}</span>
                    </div>
                    {countDownStoppedDes && <div className={classes.capTitle}>
                      {countDownStoppedDes}
                    </div>}
                </div>
                <div className={isMobile ? classes.mobileLiquidityInfoCol : classes.liquidityInfoCol}>
                    <div className={classes.statTitle}>
                        Claimable rewards
                    </div>
                    <div className={classes.statTitleBot}>
                        <div>
                            <div className={classes.statNum}>{claimableReward} OP</div>
                        </div>
                        {renderBtn()}
                    </div>
                </div>
                <div className={isMobile ? classes.mobileLiquidityInfoCol : classes.liquidityInfoCol}>
                    <div className={classes.statTitle}>
                        Claimed Rewards
                    </div>
                    <div className={classes.statTitleBot}>
                        <div>
                            <div className={classes.statNum}>{String(personalSoFarSumReward)} OP</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const onClaimSuccessModalclose = async () => {
      setClaimSuccessModalState(false);
      showLoading(true);
      const id = process.env.REACT_APP_ENV === "MAINNET" ? process.env.REACT_APP_OPTIMISM_ID : process.env.REACT_APP_BSC_ID;
      const timer = setInterval(async () => {
        const res = await destinationRelayCheckerByTxHash(Number(id), claimTxHash);
        if(res) {
          clearInterval(timer);
          initData();
        }
      }, 5000)
    }
    return (
        <div className={classes.liquidityContent}>
          {liquidityInfoPanel()}

          {switchChainModalState && (
            <SwitchChainModal
              showModal={switchChainModalState}
              claimTitle="fee rebate"
              onClose={() => {
                setSwitchChainModalState(false);
              }}
            />
          )}
    
          {claimSuccessModalState && (
            <ClaimSuccessModal
              modaldes="Your request to claim the fee rebate has been submitted"
              txHash={claimTxHash}
              onClose={onClaimSuccessModalclose}
            />
          )}
        </div>
      );
}