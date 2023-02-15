import { Button, Dropdown, Menu, Typography } from "antd";
import { useCallback } from "react";
import { createUseStyles } from "react-jss";
import Icon from "@ant-design/icons";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { ModalName, openModal } from "../../redux/modalSlice";
import { Theme } from "../../theme/theme";
import { useWalletConnectionContext } from "../../providers/WalletConnectionContextProvider";
import { useNonEVMContext, isNonEVMChain, getNonEVMMode, NonEVMMode } from "../../providers/NonEVMContextProvider";
import WalletIcon from "./WalletIcon";
import { ReactComponent as logoOutIcon } from "../../images/logoOutIcon.svg";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  addressBtn: {
    marginLeft: props => (props.isMobile ? 0 : 8),
    height: props => (props.isMobile ? 24 : 44),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: props => (props.isMobile ? theme.primaryBackground : theme.secondBackground),
    transition: "none !important",
    backdropFilter: "blur(20px)",
    borderRadius: 12,
    minWidth: 50,
    fontWeight: props => (props.isMobile ? 400 : 700),
    padding: props => (props.isMobile ? "0px 8px" : "4px 4px 4px 8px"),
    border: "1px solid transparent",
    boxSizing: "border-box",
    "& .ant-typography": {
      width: props => (props.isMobile ? 100 : 120),
      color: theme.surfacePrimary,
      background: theme.primaryBorder,
      borderRadius: 8,
      paddingTop: props => (props.isMobile ? "0px" : "5px"),
      paddingBottom: props => (props.isMobile ? "0px" : "5px"),
      fontSize: props => (props.isMobile ? "12px" : "14px"),
      fontWeight: props => (props.isMobile ? "400" : "700"),
    },
    "&:hover": {
      background: props => (props.isMobile ? theme.primaryBackground : theme.secondBackground),
      border: `1px solid ${theme.primaryBorder} !important`,
    },
    "&:focus": {
      background: props => (props.isMobile ? theme.primaryBackground : theme.secondBackground),
      border: `1px solid transparent !important`,
    },
  },

  buttonText: {
    position: "relative",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },

  connectBtn: {
    marginLeft: 8,
    height: 44,
    background: theme.primaryBrand,
    backdropFilter: "blur(20px)",
    border: "none",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    lineHeight: "16px",
    "& .ant-typography": {
      width: 120,
      color: theme.surfacePrimary,
    },
    "&:hover": {
      background: theme.buttonHover,
      color: theme.unityWhite,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
  dropDownMenu: {
    background: theme.secondBackground,
    border: `1px solid ${theme.primaryBorder}`,
    borderRadius: "12px",
    padding: 0,
    "& .ant-dropdown-menu-item": {
      color: theme.secondBrand,
      background: theme.secondBackground,
      padding: props => (props.isMobile ? 2 : 8),
      "&:hover": {
        "& .ant-dropdown-menu-title-content": {
          background: theme.primaryBorder,
        },
        color: theme.surfacePrimary,
        "& svg g": {
          stroke: theme.surfacePrimary,
        },
        "& svg path": { fill: theme.surfacePrimary },
      },
    },
    "& .ant-dropdown-menu-title-content": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 8,
      padding: props => (props.isMobile ? "2px 8px" : "5px 8px"),
    },
  },
  logoutBtn: {
    color: theme.surfacePrimary,
    borderRadius: "10px",
    fontSize: 12,
    fontWeight: 600,
    padding: props => (props.isMobile ? "5px 10px" : "10px"),
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 24,
    verticalAlign: "middle",
    marginLeft: 8,
    background: theme.infoSuccess,
  },
}));

export default function Account(): JSX.Element {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const { fromChain } = useAppSelector(state => state.transferInfo);
  const classes = useStyles({ isMobile });
  const { logoutOfWeb3Modal } = useWeb3Context();
  const { logoutNonEVMModal } = useNonEVMContext();
  const { connected, walletAddress, walletConnectionButtonTitle } = useWalletConnectionContext();
  const dispatch = useAppDispatch();

  const showWalletConnectionProviderModal = useCallback(() => {
    const nonEVMMode = getNonEVMMode(fromChain?.id ?? 0);
    switch (nonEVMMode) {
      case NonEVMMode.flowMainnet:
      case NonEVMMode.flowTest: {
        dispatch(openModal(ModalName.flowProvider));
        break;
      }
      case NonEVMMode.aptosMainnet:
      case NonEVMMode.aptosTest:
      case NonEVMMode.aptosDevnet: {
        dispatch(openModal(ModalName.aptosProvider));
        break;
      }
      case NonEVMMode.seiMainnet:
      case NonEVMMode.seiDevnet:
      case NonEVMMode.seiTestnet: {
        dispatch(openModal(ModalName.seiProvider));
        break;
      }
      case NonEVMMode.injectiveTestnet:
      case NonEVMMode.injectiveMainnet: {
        dispatch(openModal(ModalName.injProvider));
        break;
      }
      default: {
        dispatch(openModal(ModalName.provider));
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fromChain]);

  const walletConnectionLogout = () => {
    if (isNonEVMChain(fromChain?.id ?? 0)) {
      logoutNonEVMModal();
    } else {
      logoutOfWeb3Modal();
    }
  };

  if (connected) {
    const menu = (
      <Menu className={classes.dropDownMenu}>
        <Menu.Item className={classes.logoutBtn} key="logout" onClick={walletConnectionLogout}>
          Disconnect
          <Icon component={logoOutIcon} style={{ fontSize: 14 }} />
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button className={classes.addressBtn} type="ghost">
          <WalletIcon />
          <Typography.Text ellipsis={{ suffix: walletAddress.slice(-4) }}>
            {walletAddress.substr(0, 6) + "..."}
          </Typography.Text>
          {/* <span className={classes.indicator} /> */}
        </Button>
      </Dropdown>
    );
  }

  if (isMobile) {
    return <div />;
  }
  return (
    <>
      <Button type="primary" className={classes.connectBtn} onClick={showWalletConnectionProviderModal}>
        {walletConnectionButtonTitle}
      </Button>
    </>
  );
}
