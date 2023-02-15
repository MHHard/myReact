/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useCallback, useContext, useState, useEffect } from "react";
import { Button, Spin } from "antd";
import { createUseStyles } from "react-jss";
import { useHistory } from "react-router";
import { Theme } from "../theme";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { ModalName, openModal } from "../redux/modalSlice";
import FeeRebate from "../components/rewards/FeeRebate";
import rewardsDarkIcon from "../images/rewardsDark.png";
import rewardsLightIcon from "../images/rewardsLight.png";
import { ColorThemeContext } from "../providers/ThemeProvider";
import RetentionRewards from "../components/rewards/RetentionRewards";
import BSCCampaign from "../components/rewards/BSCCampaign";
import { getBscCampaignInfo } from "../redux/gatewayCbridge";
import { BscCampaignInfo, GetBscCampaignInfoRequest, GetBscCampaignInfoResponse } from "../proto/gateway/gateway_pb";
import OPFeeRebate from "../components/rewards/OPFeeRebate";
// import CBridgeCarnival from "../components/rewards/CBridgeCarnival";

/* eslint-disable camelcase */
const useStyles = createUseStyles((theme: Theme) => ({
  liquidityContent: {
    width: "100%",
    margin: "0 auto",
    position: "relative",
    lineHeight: 1,
    minHeight: "700px",
    maxWidth: "1200px",
  },

  mobileLiquidityContent: {
    // width: "100%",
    margin: "0 auto",
    position: "relative",
    lineHeight: 1,
    marginBottom: 200,
    marginLeft: 10,
    marginRight: 10,
    maxWidth: "1200px",
  },

  connect: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginBottom: 70,
  },
  connectBtn: {
    width: 560,
    margin: "0 auto",
    height: 56,
    fontSize: 16,
    borderRadius: 16,
    background: theme.primaryBrand,
    border: 0,
    "&:focus, &:hover": {
      background: theme.buttonHover,
      color: theme.surfacePrimary,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
  contentEmpty: {
    width: "100%",
    height: 436,
    borderRadius: 16,
    background: theme.secondBackground,
    textAlign: "center",
    color: theme.surfacePrimary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    height: "30px",
    margin: "0px 0 25px 0",
  },
  emptytext: {
    fontSize: 14,
    fontWeight: 500,
  },
  whiteSpinblur: {
    "& .ant-spin-blur": {
      opacity: 0.5,
    },
    "& .ant-spin-blur::after": {
      opacity: 0.5,
    },
    "& .ant-spin-container::after": {
      background: "#f6f7fd",
    },
  },
  spinblur: {
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
}));

const Rewards: FC = () => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles();
  const { web3Modal, address } = useWeb3Context();
  const dispatch = useAppDispatch();
  const [retentionRewardVisible, setRetentionRewardVisible] = useState(false);
  const [feeRebateVisible, setFeeRebateVisible] = useState(false);
  const [opFeeRebateVisible, setOpFeeRebateVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const { themeType } = useContext(ColorThemeContext);
  const noRewardIcon = themeType === "dark" ? rewardsDarkIcon : rewardsLightIcon;
  const history = useHistory();
  const [bscCampaignInfos, setBscCampaignInfos] = useState<Array<BscCampaignInfo.AsObject>>([]);

  const onShowProviderModal = useCallback(() => {
    dispatch(openModal(ModalName.provider));
  }, [dispatch]);

  useEffect(() => {
    if (!address) {
      return;
    }
    getBscCampaigns();
  }, [address]);

  const getBscCampaigns = async () => {
    const req = new GetBscCampaignInfoRequest();
    req.setAddr(address);
    const res: GetBscCampaignInfoResponse = await getBscCampaignInfo(req);
    const resObj = res.toObject();
    console.debug(resObj);

    if (resObj.err) {
      setBscCampaignInfos([]);
    } else {
      setBscCampaignInfos(resObj.infoList);
    }
  };

  if (!web3Modal.cachedProvider) {
    const refId = sessionStorage.getItem("refId") ?? ""

    if (refId.length > 0) {
      history.push(`/?ref=${refId}`);
    } else {
      history.push("/");
    }
  
    return (
      <div className={classes.connect}>
        <Button type="primary" onClick={onShowProviderModal} className={classes.connectBtn}>
          Connect Wallet
        </Button>
      </div>
    );
  }

  const hasCBridgeCarnivalEvent = false;
  const hasEvents: boolean =
    retentionRewardVisible || feeRebateVisible || opFeeRebateVisible || bscCampaignInfos.length > 0 || hasCBridgeCarnivalEvent;
  return (
    <div className={isMobile ? classes.mobileLiquidityContent : classes.liquidityContent}>
      <div className={themeType === "dark" ? classes.spinblur : classes.whiteSpinblur}>
        <Spin spinning={loading}>
          {hasEvents ? (
            <div>
              {retentionRewardVisible && (
                <RetentionRewards
                  showRetentionRewards={visible => {
                    setRetentionRewardVisible(visible);
                  }}
                  showLoading={load => {
                    setLoading(load);
                  }}
                />
              )}
              {feeRebateVisible && (
                <FeeRebate
                  showFeeRebate={visible => {
                    setFeeRebateVisible(visible);
                  }}
                  showLoading={load => {
                    setLoading(load);
                  }} 
                />
              )}
              {opFeeRebateVisible && (
                <OPFeeRebate
                  showOPFeeRabate={visible => {
                    setOpFeeRebateVisible(visible);
                  }}
                  showLoading={load => {
                    setLoading(load);
                  }}
                  loading={loading}
                />
              )}
              {bscCampaignInfos.map(item => {
                return (
                  <BSCCampaign
                    bscCampaignInfo={item}
                    refreshBscCampaign={() => {
                      getBscCampaigns();
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className={classes.contentEmpty}>
              <div>
                <img className={classes.emptyIcon} src={noRewardIcon} alt="no_rewards" />
                <div className={classes.emptytext}>No rewards yet</div>
              </div>
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default Rewards;
