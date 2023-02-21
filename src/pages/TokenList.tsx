import { Input, Modal, Spin } from "antd";
import {
  FC,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useContext,
} from "react";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { JsonRpcProvider } from "@ethersproject/providers";
import { formatDecimal } from "number-format-utils/lib/format";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { getNetworkById } from "../constants/network";
import { dataClone } from "../helpers/dataClone";
import { useAllTokenBalances } from "../hooks/useAllTokenBalances";
import { tokenComparator } from "../helpers/sorting";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { ColorThemeContext } from "../providers/ThemeProvider";
import TokenItem from "./TokenItem";
import emptyIcon from "../images/emptyIcon.png";
import { setTokenModalTitle } from "../redux/transferSlice";
import { Token } from "../proto/chainhop/common_pb";

/* eslint-disable*/
/* eslint-disable camelcase */

interface IProps {
  onSelectToken: (symbol: string) => void;
  visible: boolean;
  onCancel: () => void;
}
export const getNativeToken = (
  chainId: number,
  tokenList: Token.AsObject[]
) => {
  const chain = getNetworkById(chainId);
  if (chain && tokenList) {
    const tokens = tokenList?.filter(
      (it) => it.address === chain.wrapTokenAddress
    );
    if (tokens && tokens?.length > 0) {
      const token = tokens[0];
      const nativeToken: Token.AsObject = {
        chainId: token.chainId,
        symbol: chain.symbol,
        address: token.address,
        name: getTokenDisplayName(chain.symbol, token.name),
        decimals: token.decimals,
        logoUri: token.logoUri,
      };
      return nativeToken;
    }
  }
  return undefined;
};
const getTokenDisplayName = (symbol, name) => {
  let tokenDisplayName = name;
  switch (symbol) {
    case "ETH":
      tokenDisplayName = "Ether";
      break;
    case "MATIC":
      tokenDisplayName = "Polygon MATIC";
      break;
    case "BNB":
      tokenDisplayName = "Binance Coin";
      break;
    case "AVAX":
      tokenDisplayName = "Avalanche";
      break;
    case "FTM":
      tokenDisplayName = "Fantom";
      break;
    default:
      tokenDisplayName = name;
  }
  return tokenDisplayName;
};
const TokenList: FC<IProps> = ({ onSelectToken, visible, onCancel }) => {
  const {
    fromChain,
    toChain,
    tokenSource,
    srcTokenList,
    dstTokenList,
    tokenModalTitle,
  } = useAppSelector((state) => state.transferInfo);
  const { isMobile } = useContext(ColorThemeContext);
  const [searchText, setSearchText] = useState("");
  const [tokenList, setTokenList] = useState<Token.AsObject[]>([]);
  const fixedList = useRef<FixedSizeList>();
  const [filterTokenList, setFilterTokenList] = useState<Token.AsObject[]>([]);
  const [sortTokenList, setSortTokenList] = useState<Token.AsObject[]>();
  const [nativeToken, setNativeToken] = useState<Token.AsObject>();
  const [nativeTokenBalance, setNativeTokenBalance] = useState<string>("--");
  const [showCustomToken, setShowCustomToken] = useState<boolean>(false);

  const cId = tokenSource === "from" ? fromChain?.chainId : toChain?.chainId;
  const { signer, address } = useWeb3Context();
  const dispatch = useAppDispatch();

  const deleteNativeToken = (list) => {
    let sortList = dataClone(list);
    const nativeTokenSymbol = getNetworkById(cId || 1).symbol;
    let index = -1;
    let nativeTokens = sortList.filter(
      (item) => item?.symbol === nativeTokenSymbol
    );
    sortList.map((item, i) => {
      if (item?.symbol === nativeTokenSymbol) {
        index = i;
      }
      return item;
    });
    if (nativeTokens.length > 0) {
      sortList.splice(index, 1);
      // sortList.unshift(nativeTokens[0]);
    }
    return sortList;
  };

  const closeModal = () => {
    dispatch(setTokenModalTitle("Select a token"));
    onCancel();
  };
  const onInputChange = (e) => {
    setSearchText(e.target.value);
    if (!e.target.value) {
      let tokenContentBox = document.getElementById("tokenContentBox");
      if (tokenContentBox) {
        tokenContentBox.scrollTop = 0;
      }
    }
  };

  const onEnter = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    if (!searchText || searchText === "") {
      setFilterTokenList([]);
      return;
    }
    const searchBaseList =
      sortTokenList && sortTokenList?.length > 0 ? sortTokenList : tokenList;
    const list = searchBaseList?.filter((item) => {
      if (!item) {
        return false;
      }
      const chainNameFeatch =
        item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
      const addressFeatch =
        item?.address
          .toString()
          .toLowerCase()
          .indexOf(searchText.toLowerCase()) > -1;
      const symbolFeatch =
        item?.symbol
          .toString()
          .toLowerCase()
          .indexOf(searchText.toLowerCase()) > -1;
      const isFilter = chainNameFeatch || addressFeatch || symbolFeatch;
      return isFilter;
    });
    // const sortList = topNativeToken(list);
    setFilterTokenList(list);
    if (searchText.trim().indexOf("0x") === 0 && list?.length === 0) {
      changeCustom();
    }
  }, [searchText, tokenList, sortTokenList]);

  useEffect(() => {
    if (!tokenSource) {
      return;
    }
    if (tokenSource === "from" && srcTokenList) {
      setTokenList(srcTokenList);
    } else {
      setTokenList(dstTokenList);
    }
  }, [srcTokenList, dstTokenList, tokenSource]);

  useEffect(() => {
    dispatch(setTokenModalTitle("Select a token"));
  }, []);

  let balances;
  if (signer) {
    balances = useAllTokenBalances();
  }
  useMemo(() => {
    if (!tokenList || tokenList.length === 0) {
      return;
    }
    const originalTokenList = dataClone(tokenList);
    let sortTokenList = originalTokenList;
    if (balances) {
      sortTokenList = originalTokenList.sort((a, b) =>
        tokenComparator(balances, a, b)
      );
    }

    const nativeToken = getNativeToken(cId ?? 0, sortTokenList);
    if (nativeToken) {
      setNativeToken(nativeToken);
      const lsitWithNoNative = deleteNativeToken(sortTokenList);
      setSortTokenList([nativeToken, ...lsitWithNoNative]);
    } else {
      setSortTokenList(sortTokenList);
    }
  }, [balances, tokenList]);
  const Row = useCallback(
    function TokenRow({ data, index, style }) {
      const row: Token.AsObject = data[index];
      if (row) {
        let isNativeToken = false;
        const chainInfo = getNetworkById(cId ?? -1);
        if (row.symbol === chainInfo?.symbol) {
          isNativeToken = true;
        }
        const key = isNativeToken
          ? `nativeToken-${row.symbol}`
          : `${row.address}-${row.symbol}`;

        return (
          <div style={style} key={`${key}`}>
            <TokenItem
              key={`${key}`}
              itemKey={`${key}`}
              onSelectToken={onSelectToken}
              tokenInfo={row}
              nativeTokenBalance={nativeTokenBalance}
              tokenBalance={
                JSON.stringify(balances) === "{}" ||
                balances === undefined ||
                balances[row.address] === undefined
                  ? "--"
                  : balances[row.address]
              }
            />
          </div>
        );
      } else {
        return null;
      }
    },
    [tokenList, balances]
  );

  useMemo(() => {
    if (!nativeToken || !signer) {
      return;
    }
    const loadNativeTokenBalance = async () => {
      const rpcUrl = getNetworkById(cId ?? -1)?.rpcUrl;
      if (rpcUrl) {
        const provider = new JsonRpcProvider(rpcUrl);
        const balanceResult = await provider.getBalance(address);
        const balance = formatDecimal(balanceResult, 6, nativeToken.decimals);
        setNativeTokenBalance(balance);
      }
    };
    loadNativeTokenBalance();
  }, [nativeToken]);

  const itemKey = useCallback((index: number, data: typeof tokenList) => {
    const currency = data[index];
    return currency.address;
  }, []);

  const getTableList = (
    filterTokenList,
    sortTokenList,
    tokenList,
    searchText
  ) => {
    let tableList = [];
    if (filterTokenList.length > 0 || searchText) {
      tableList = filterTokenList;
    } else if (sortTokenList && sortTokenList.length > 0) {
      tableList = sortTokenList;
    } else {
      tableList = tokenList;
    }

    return tableList;
  };

  const tableList = getTableList(
    filterTokenList,
    sortTokenList,
    tokenList,
    searchText
  );
  const changeCustom = () => {
    setShowCustomToken(true);
  };

  return (
    <Modal
      onCancel={() => {
        closeModal();
      }}
      visible={visible}
      footer={null}
      maskClosable={false}
      width={512}
      title={tokenModalTitle}
      destroyOnClose
      className="tokenModal"
    >
      <Spin spinning={false} wrapperClassName="tokenSpin">
        <div className="tokenModalContent">
          <div>
              <Input
                className="searchinput"
                placeholder="Search token by name or address"
                onChange={onInputChange}
                onPressEnter={onEnter}
                allowClear
                autoFocus={!isMobile}
              />
            {tableList?.length > 0 ? (
              <div style={{ minHeight: isMobile ? 250 : 500 }}>
                <AutoSizer disableWidth>
                  {({ height }) => (
                    <FixedSizeList
                      height={height}
                      width="100%"
                      itemCount={tableList.length}
                      itemData={tableList}
                      ref={fixedList as any}
                      itemSize={64}
                      itemKey={itemKey}
                    >
                      {Row}
                    </FixedSizeList>
                  )}
                </AutoSizer>
              </div>
            ) : (
              <div style={{ paddingRight: 24 }}>
                {searchText && (
                  <div
                    className="noResult"
                    style={{
                      width: "100%",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    <div style={{ marginTop: 60 }}>
                      <img src={emptyIcon} alt="" width={40} />
                    </div>
                    <div className="tokenNoResultText">Nothing found</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default TokenList;
