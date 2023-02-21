import { Image } from "antd";
import { formatBalance } from "number-format-utils/lib/format";
import { LoadingOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { useAppSelector } from "../redux/store";
import { storageConstants } from "../constants/const";
import { getNetworkById } from "../constants/network";
import { getLocalTokenIconBySymbol } from "../constants/token_icons";
import tokenNoIcon from "../images/tokenNoIcon.svg";
import { cacheIcons } from "../redux/chainhop";

/* eslint-disable*/
/* eslint-disable camelcase */

const TokenItem = ({
  itemKey,
  onSelectToken,
  tokenInfo,
  nativeTokenBalance,
  tokenBalance,
}) => {
  const { signer } = useWeb3Context();

  const { fromChain, toChain, tokenSource } = useAppSelector(
    (state) => state.transferInfo
  );
  const { symbol, logoUri } = tokenInfo;
  const cId = useMemo(() => {
    return tokenSource === "from" ? fromChain?.chainId : toChain?.chainId;
  }, [tokenSource, fromChain, toChain]);

  const rpcUrl = useMemo(() => {
    if (cId) {
      return getNetworkById(cId || -1)?.rpcUrl;
    }
  }, [cId]);

  const [itemBalance, setItemBalance] = useState<string>();
  const [icon, setIcon] = useState<string>();

  useMemo(() => {
    if (!tokenInfo) {
      return;
    }
    let isNativeToken = false;
    const chainInfo = getNetworkById(cId ?? -1);
    if (tokenInfo.symbol === chainInfo?.symbol) {
      isNativeToken = true;
    }

    let balance;
    if (isNativeToken) {
      balance = nativeTokenBalance;
    } else {
      if (tokenBalance === "--") {
        balance = "--";
      } else {
        balance =
          tokenBalance < 0.000001
            ? 0
            : formatBalance(tokenBalance, 6, "floor", ",", true);
      }
    }
    console.log('itemBalance:', itemBalance)
    setItemBalance(balance);
  }, [tokenBalance, tokenInfo, rpcUrl]);

  useMemo(() => {
    if (!itemKey) {
      return;
    }

    // fetch icon from memory first
    if (cacheIcons[itemKey]) {
      setIcon(cacheIcons[itemKey]);
      return;
    }

    let icon = getLocalTokenIconBySymbol(tokenInfo?.symbol);

    if (!icon) {
      icon = tokenInfo?.logoUri;
    }

    if (!icon) {
      icon = "./tokenIcons/tokenNoIcon.svg";
    }

    cacheIcons[itemKey] = icon;
    setIcon(icon);
  }, [itemKey, symbol, logoUri]);

  return (
    <div
      className={
        localStorage.getItem(storageConstants.KEY_SELECTED_TOKEN_SYMBOL) === symbol
          ? "activeItem"
          : "item"
      }
      onClick={() => {
        onSelectToken(symbol);
      }}
    >
      <div className={"litem"}>
        <div className={"itemLeft"}>
          <Image
            preview={false}
            src={icon}
            fallback={tokenNoIcon}
            onError={() => {
              cacheIcons[itemKey] = tokenNoIcon;
            }}
          />
          <div style={{ marginLeft: 8 }}>
            <div className={"tokenName"}>{tokenInfo.name}</div>
          </div>
        </div>
        <div className={"tokenBlance"} style={{ textAlign: "left" }}>
          {itemBalance === "--" ? (
            <span>{!signer ? "--" : <LoadingOutlined />}</span>
          ) : (
            <span>{itemBalance}</span>
          )}{" "}
          <span className="tokenSymbolName" style={{ marginLeft: 5 }}>
            {symbol}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TokenItem;
