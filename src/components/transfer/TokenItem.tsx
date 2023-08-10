import { Avatar } from "antd";
import { createUseStyles } from "react-jss";
import { useAppSelector } from "../../redux/store";
import { Theme } from "../../theme";
import { getTokenListSymbol } from "../../redux/transferSlice";
import { TokenInfo } from "../../constants/type";
import { isETH } from "../../helpers/tokenInfo";
import { kavaPegTokens } from "../../constants/const";

/* eslint-disable camelcase */
const useStyles = createUseStyles((theme: Theme) => ({
  card: {
    // background: theme.primaryBackground,
    width: "100%",
    paddingBottom: 15,
    "@global": {
      ".ant-list-item": {
        padding: "10px 12px",
      },
      ".ant-list-item-meta-title": {
        fontSize: 16,
        marginBottom: 0,
      },
      ".ant-list-item-meta-description": {
        fontSize: 12,
      },
    },
    "&.ant-card": {
      height: "100%",
    },
    "& .ant-card-body": {
      padding: 0,
      overflow: "hidden",
    },

    "& .ant-list-item": {
      border: "none",
    },

    "& .ant-list-item-meta": {
      alignItems: "center",
    },
    "& .ant-card-head-title": {
      padding: "24px 0",
    },
  },
  item: {
    cursor: "pointer",
    overflow: "hidden",
    margin: "10px 20px",
    borderRadius: 16,
    background: theme.chainBg,
    color: theme.surfacePrimary,
    border: `1px solid ${theme.primaryBorder} !important`,
    "&:hover": {
      background: theme.primaryBorder,
      transition: "ease 0.2s",
    },
  },
  activeItem: {
    composes: ["item"],
    color: theme.surfacePrimary,
    margin: "10px 20px",
    transition: "ease 0.2s",
    borderRadius: 16,
    background: theme.chainBg,
    border: `1px solid ${theme.primaryBrand} !important`,
    "& div": {
      color: theme.surfacePrimary,
    },
  },
  litem: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
  },
  itemLeft: {
    display: "flex",
    alignItems: "center",
  },
  tokenName: {
    fontSize: 16,
    textAlign: "left",
  },
  tokenSymbol: {
    fontSize: 12,
    textAlign: "left",
  },
}));

const TokenItem = ({ onSelectToken, tokenInfo }) => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles();
  const { fromChain, selectedToken } = useAppSelector(state => state.transferInfo);
  const { icon, token } = tokenInfo;
  const { symbol } = token;
  const tokenBalance = tokenInfo.balance;

  const displayTokenName = (localTokenInfo: TokenInfo) => {
    if (isETH(localTokenInfo.token)) {
      return "Ethereum Token";
    }

    if (fromChain?.id === 2222 && kavaPegTokens.includes(localTokenInfo?.token.symbol ?? "")) {
      return localTokenInfo?.name + " (Celer)";
    }

    if ((fromChain?.id === 42161 || fromChain?.id === 421613) && localTokenInfo?.token.symbol === "USDC") {
      return "Bridged USDC";
    }

    return localTokenInfo?.name ?? "";
  };

  const isTokenSelected = (localTokenInfo: TokenInfo) => {
    if (localTokenInfo.token.chainId !== selectedToken?.token.chainId) {
      return false;
    }

    const localTokenIsETH = isETH(localTokenInfo.token);
    const selectedTokenIsETH = isETH(selectedToken.token);

    if (localTokenIsETH && selectedTokenIsETH) {
      return true;
    }

    if (!localTokenIsETH && !selectedTokenIsETH) {
      return selectedToken?.token.address === tokenInfo.token.address;
    }

    return false;
  };

  return (
    <div
      className={isTokenSelected(tokenInfo) ? classes.activeItem : classes.item}
      onClick={() => {
        onSelectToken(tokenInfo);
      }}
    >
      <div className={classes.litem}>
        <div className={classes.itemLeft}>
          <Avatar size="large" src={icon} />
          <div style={{ marginLeft: 8 }}>
            <div className={classes.tokenName}>{displayTokenName(tokenInfo)}</div>
          </div>
        </div>
        <div className={classes.tokenName} style={{ textAlign: isMobile ? "right" : "left" }}>
          {tokenBalance}{" "}
          <span className="tokenSymbolName" style={{ marginLeft: 5 }}>
            {isETH(token) ? "ETH" : getTokenListSymbol(symbol, fromChain?.id)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TokenItem;
