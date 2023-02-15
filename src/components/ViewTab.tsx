import { FC, useState, useEffect } from "react";
import { Menu } from "antd";
import { createUseStyles } from "react-jss";
import { Link, useLocation } from "react-router-dom";
import { Theme } from "../theme";
import { useAppSelector } from "../redux/store";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { generateTabKey, TabKeys } from "../helpers/viewTabKeyGeneration";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  flexCenter: {
    display: "flex",
    flexFlow: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    zIndex: 200,
    width: props => (props.isMobile ? "92%" : 400),
    marginLeft: props => (props.isMobile ? "4%" : 0),
  },
  mobileTopDeco: {
    width: "100%",
    height: 32,
    borderRadius: "8px 8px 0px 0px",
    borderTop: "1px solid #40424E",
  },
  menuLogin: {
    width: "380px !important",
    maxWidth: props => (props.isMobile ? "100%" : 380),
  },
  menuLogout: {
    width: "331px !important",
    maxWidth: props => (props.isMobile ? "100%" : 330),
  },

  menu: {
    marginBottom: 0,
    height: props => (props.isMobile ? 40 : 44),
    background: theme.primaryUnable,
    borderRadius: 12,
    border: "none",
    display: "flex",
    justifyContent: "space-around",
    padding: 3,
    "& .ant-menu-item": {
      textAlign: "center",
      fontSize: 16,
      fontWeight: 700,
      borderRadius: 8,
      top: 0,
      lineHeight: props => (props.isMobile ? "33px" : "39px"),
      "&:hover": {
        color: theme.surfacePrimary,
      },
    },
    "& .ant-menu-item::after": {
      borderBottom: "0 !important",
    },
    "& .ant-menu-item a": {
      color: theme.secondBrand,
      fontSize: props => (props.isMobile ? "14px" : "16px"),
      fontWeight: 700,
      "&:hover": {
        color: theme.primaryBrand,
      },
    },
    "& .ant-menu-item-selected": {
      background: theme.primaryBrand,
    },
    "& .ant-menu-item-selected:hover": {
      background: theme.primaryBrand,
      color: "#fff !important",
    },
    "& .ant-menu-item-selected a": {
      color: theme.unityWhite,
      "&:hover": {
        color: `${theme.unityWhite} !important`,
      },
    },
  },
}));

const ViewTab: FC = () => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const location = useLocation();
  const { web3Modal } = useWeb3Context();
  const [route, setRoute] = useState<string>("");
  const { hasEvents } = useAppSelector(state => state.rewardSection);
  const { fromChain, toChain, selectedToken } = useAppSelector(state => state.transferInfo);

  useEffect(() => {
    setRoute(generateTabKey(location.pathname));
  }, [location]);

  const refId = sessionStorage.getItem("refId") ?? "";
  const transferSearch = refId.length === 0 ? "" : "ref=" + refId;

  const transferPathName = () => {
    if (fromChain && toChain && selectedToken) {
      return `/${fromChain.id}/${toChain.id}/${selectedToken.token.symbol}`;
    }
    return "/";
  };

  return (
    <div className={classes.flexCenter}>
      {isMobile ? <div className={classes.mobileTopDeco} /> : null}
      {web3Modal.cachedProvider && hasEvents ? (
        <Menu
          className={classes.menu}
          style={{ width: isMobile ? "100%" : 380 }}
          selectedKeys={[route]}
          mode="horizontal"
        >
          <Menu.Item
            key={TabKeys.Transfer}
            style={{ width: isMobile ? "auto" : 92, padding: isMobile ? "0 10px" : "0 12px" }}
          >
            <Link to={{ pathname: transferPathName(), search: transferSearch }}>Transfer</Link>
          </Menu.Item>
          <Menu.Item
            key={TabKeys.Liquidity}
            style={{ width: isMobile ? "auto" : 92, padding: isMobile ? "0 10px" : "0 12px" }}
          >
            <Link to="/liquidity">Liquidity</Link>
          </Menu.Item>
          <Menu.Item
            key={TabKeys.NFT}
            style={{ width: isMobile ? "auto" : 98, padding: isMobile ? "0 10px" : "0 12px" }}
          >
            <Link to="/nft">NFT</Link>
          </Menu.Item>
          <Menu.Item
            key={TabKeys.Rewards}
            style={{ width: isMobile ? "auto" : 92, padding: isMobile ? "0 10px" : "0 12px" }}
          >
            <Link to="/rewards">Rewards</Link>
          </Menu.Item>
        </Menu>
      ) : (
        <Menu
          className={classes.menu}
          style={{ width: isMobile ? "100%" : 330 }}
          selectedKeys={[route]}
          mode="horizontal"
        >
          <Menu.Item key={TabKeys.Transfer}>
            <Link to={{ pathname: transferPathName(), search: transferSearch }}>Transfer</Link>
          </Menu.Item>
          <Menu.Item key={TabKeys.Liquidity}>
            <Link to="/liquidity">Liquidity</Link>
          </Menu.Item>
          <Menu.Item key={TabKeys.NFT} style={{ width: 108 }}>
            <Link to="/nft">NFT</Link>
          </Menu.Item>
        </Menu>
      )}
    </div>
  );
};

export default ViewTab;
