import { Dropdown, Menu } from "antd";
import { useContext } from "react";
import { createUseStyles } from "react-jss";
import Icon from "@ant-design/icons";
import { useAppSelector } from "../../redux/store";
import { Theme } from "../../theme/theme";
// import CoinBasePay from "../../views/CoinBasePay";
import { ColorThemeContext } from "../../providers/ThemeProvider";
import { ReactComponent as light } from "../../images/light.svg";
import { ReactComponent as dark } from "../../images/dark.svg";
import AddSeiChain from "../common/AddSeiChain";
import AddInjChain from "../common/AddInjectiveChain";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  buttonText: {
    position: "relative",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },

  connectBtn: {
    height: 40,
    background: theme.primaryBrand,
    backdropFilter: "blur(20px)",
    border: "none",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: "16px",
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
  dropDownMenu: {
    background: theme.secondBackground,
    opacity: 1,
    border: `1px solid ${theme.primaryBorder}`,
    borderRadius: "12px",
    padding: 8,
    textAlign: "left",
    color: theme.secondBrand,
    fontWeight: 600,
    "& .ant-dropdown-menu-item": {
      color: theme.secondBrand,
      borderRadius: 8,
      padding: "5px 8px",
      fontSize: "12px",
      fontWeight: 600,
      width: "100%",
      "& svg g": {
        stroke: theme.secondBrand,
      },
      "& svg path": { fill: theme.secondBrand },
      "&:hover": {
        "& svg g": {
          stroke: theme.surfacePrimary,
        },
        "& svg path": { fill: theme.surfacePrimary },
      },
    },
    "& .ant-dropdown-menu-item-active": {
      color: theme.surfacePrimary,
      background: theme.primaryBorder,
    },
    "& .ant-dropdown-menu-item-selected": {
      color: theme.surfacePrimary,
      background: theme.primaryBorder,
    },

    "& .ant-typography": {
      width: 86,
      color: theme.surfacePrimary,
    },
  },
  logoutBtn: {
    color: theme.surfacePrimary,
    textAlign: "center",
    fontSize: 14,
    fontWeight: 700,
    padding: "10px",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 24,
    display: "inline-block",
    marginLeft: 8,
    background: theme.infoSuccess,
  },
  menuBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: props => (props.isMobile ? 22 : 44),
    width: 44,
    marginLeft: props => (props.isMobile ? 0 : 8),
    padding: props => (props.isMobile ? "0px 8px" : "0"),
    borderRadius: 12,
    background: props => (props.isMobile ? theme.primaryBackground : theme.secondBackground),
    position: "relative",
    cursor: "pointer",
    boxSizing: "border-box",
    border: "1px solid transparent",
    "&:hover": {
      border: `1px solid ${theme.primaryBorder}`,
    },
  },
  menuDot: {
    position: "absolute",
    top: -10,
    fontSize: 30,
    color: theme.surfacePrimary,
    fontWeight: props => (props.isMobile ? 400 : 700),
  },
}));

export default function MenuButton(): JSX.Element {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const { themeType, toggleTheme } = useContext(ColorThemeContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const childRef = useRef<any>(null);
  // const openCoinbase = () => {
  //   if (childRef.current) {
  //     childRef.current?.openCoinBasePay();
  //   }
  // };
  const toggleIconUrl = themeType === "dark" ? light : dark;
  const openSite = key => {
    let site = "";
    switch (key) {
      case "Docs":
        site = "https://cbridge-docs.celer.network";
        break;
      case "Tutorial":
        site = "https://cbridge-docs.celer.network/tutorial";
        break;
      case "FAQ":
        site = "https://cbridge-docs.celer.network/faq";
        break;
      case "AuditReports":
        site = "https://cbridge-docs.celer.network/reference/audit-reports";
        break;
      case "SDK":
        site = "https://cbridge-docs.celer.network/developer";
        break;
      case "ContactSupport":
        site = "https://form.typeform.com/to/Q4LMjUaK";
        break;
      case "TokenAddresses":
        site = "https://cbridge-docs.celer.network/reference/token-addresses";
        break;
      case "BugBounty":
        site = "https://immunefi.com/bounty/celer/";
        break;
      default:
        break;
    }
    window.open(site, "_blank");
  };
  const menu = (
    <Menu className={classes.dropDownMenu}>
      <Menu.Item key="Docs" onClick={() => openSite("Docs")}>
        Docs
      </Menu.Item>
      <Menu.Item key="Tutorial" onClick={() => openSite("Tutorial")}>
        Tutorial
      </Menu.Item>
      <Menu.Item key="FAQ" onClick={() => openSite("FAQ")}>
        FAQ
      </Menu.Item>
      <Menu.Item key="AuditReports" onClick={() => openSite("AuditReports")}>
        Audit Reports
      </Menu.Item>
      <Menu.Item key="SDK" onClick={() => openSite("SDK")}>
        SDK
      </Menu.Item>
      <Menu.Item key="ContactSupport" onClick={() => openSite("ContactSupport")}>
        Contact Support
      </Menu.Item>
      <Menu.Item key="TokenAddresses" onClick={() => openSite("TokenAddresses")}>
        Contract Addresses
      </Menu.Item>
      <Menu.Item key="BugBounty" onClick={() => openSite("BugBounty")}>
        Bug Bounty
      </Menu.Item>
      {(process.env.REACT_APP_ENV === "TEST" || process.env.REACT_APP_ENV === "DEV") && (
        <Menu.Item key="AddDevSeiChain">
          <AddSeiChain
            rpcUrl="https://im-staging-api.celer.network/sei/rpc/"
            restUrl="https://im-staging-api.celer.network/sei/lcd/"
            chainId="sei-devnet-test"
          />
        </Menu.Item>
      )}
      {(process.env.REACT_APP_ENV === "TEST" || process.env.REACT_APP_ENV === "DEV") && (
        <Menu.Item key="AddSeiChain">
          <AddSeiChain
            rpcUrl={process.env.REACT_APP_SEI_RPC}
            restUrl={process.env.REACT_APP_SEI_LCD}
            chainId="sei-devnet-1"
          />
        </Menu.Item>
      )}
      {(process.env.REACT_APP_ENV === "TEST" || process.env.REACT_APP_ENV === "DEV") && (
        <Menu.Item key="AddInjChain">
          <AddInjChain
            rpcUrl={process.env.REACT_APP_INJECTIVE_RPC}
            restUrl={process.env.REACT_APP_INJECTIVE_LCD}
            chainId="injective-test"
          />
        </Menu.Item>
      )}
      <Menu.Item key="theme" onClick={toggleTheme} className="themeChangeSmall">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>{themeType === "dark" ? "Light Theme" : "Dark Theme"} </div>
          <Icon component={toggleIconUrl} style={{ fontSize: 13 }} />
        </div>
      </Menu.Item>
      {/* <Menu.Item
        key="CoinBasePay"
        onClick={() => {
          openCoinbase();
        }}
      >
        <CoinBasePay ref={childRef} />
      </Menu.Item> */}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <div className={classes.menuBtn}>
        <div className={classes.menuDot}>...</div>
      </div>
    </Dropdown>
  );
}
