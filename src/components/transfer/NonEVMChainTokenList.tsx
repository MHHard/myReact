import { Input, Modal, Spin } from "antd";
import { FC, useState, useEffect, useMemo } from "react";
import { createUseStyles } from "react-jss";
import { debounce } from "lodash";
import { formatDecimalPart } from "celer-web-utils/lib/format";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { useAppSelector } from "../../redux/store";
import { Theme } from "../../theme";
import TokenItem from "./TokenItem";
import { usePeggedPairConfig } from "../../hooks/usePeggedPairConfig";
import { TokenInfo } from "../../constants/type";
import { SupportTokenListResult, useTransferSupportedTokenList } from "../../hooks/transferSupportedInfoList";
import ringBell from "../../images/ringBell.svg";
import { getNonEVMMode, NonEVMMode, useNonEVMContext } from "../../providers/NonEVMContextProvider";
import { checkTokenBalanceForFlowAccount } from "../../redux/NonEVMAPIs/flowAPIs";
import { getAptosResources } from "../../redux/NonEVMAPIs/aptosAPIs";
import { getSeiNativeTokenBalance, getSeiTokenBalance } from "../../redux/NonEVMAPIs/seiAPI";
import { isGasToken } from "../../constants/network";
import { getInjNativeTokenBalance, getInjTokenBalance } from "../../redux/NonEVMAPIs/injectiveAPI";

/* eslint-disable camelcase */

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  tokenModal: {
    width: props => (props.isMobile ? "100%" : 512),
    minWidth: props => (props.isMobile ? "100%" : 448),
    background: theme.secondBackground,
    border: props => (props.isMobile ? 0 : `1px solid grey`),
    "& .ant-modal-content": {
      background: theme.secondBackground,
      boxShadow: props => (props.isMobile ? "none" : ""),
    },
    "& .ant-modal-body": {
      padding: "0 !important",
    },
    "& .ant-modal": {
      background: theme.secondBackground,
    },
    "& .ant-modal-header": {
      background: `${theme.secondBackground} !important`,
    },
    "& .ant-modal-title": {
      color: `${theme.surfacePrimary} !important`,
    },
  },
  card: {
    background: theme.secondBackground,
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
    "&:hover": {
      background: theme.surfacePrimary10,
      transition: "ease 0.2s",
    },
  },
  activeItem: {
    composes: ["item"],
    background: theme.secondBackground,
    border: `1px solid ${theme.primaryBrand} !important`,
    transition: "ease 0.2s",
    borderRadius: 16,
  },
  litem: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: theme.secondBrand,
  },
  itemLeft: {
    display: "flex",
    alignItems: "center",
  },
  tokenName: {
    fontSize: 16,
    color: theme.secondBrand,
    textAlign: "left",
  },
  tokenSymbol: {
    fontSize: 12,
    color: theme.secondBrand,
    textAlign: "left",
  },
  search: {
    margin: 16,
    "& .ant-input": {
      fontSize: 14,
      background: theme.secondBackground,
      color: theme.secondBrand,
    },
    "& .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover": {
      borderColor: "#1890ff",
    },
    "& .ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused": {
      borderColor: "#1890ff",
    },
    "& .ant-input-clear-icon": {
      color: "#8F9BB3 !important",
    },
  },
  searchinput: {
    width: "100%",
    height: 48,
    borderRadius: 100,
    border: "1px solid #4e4c4c",
    background: theme.secondBackground,
  },

  itemList: {
    maxHeight: 510,
    minHeight: 126,
    overflowY: "auto",
  },
  moreOptionNote: {
    margin: 16,
    minHeight: 56,
    borderRadius: 16,
    padding: "8px, 12px, 8px, 12px",
    background: theme.chainBg,
    boxShadow: "0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)",
    display: "flex",
    alignItems: "center",
  },
  moreOptionIcon: {
    margin: 17,
  },
}));

interface IProps {
  onSelectToken: (symbol: string) => void;
  visible: boolean;
  onCancel: () => void;
}

const NonEVMChainTokenList: FC<IProps> = ({ onSelectToken, visible, onCancel }) => {
  const { provider, address, chainId } = useWeb3Context();
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const { fromChain, toChain, flowTokenPathConfigs } = useAppSelector(state => state.transferInfo);

  const transferSupportedTokensResult = useTransferSupportedTokenList();

  // const { fromChainId, supportTokenList } = transferSupportedTokensResult;

  const [searchText, setSearchText] = useState("");
  const pegConfig = usePeggedPairConfig();

  const [tokenListWithBalance, setTokenListWithBalance] = useState(transferSupportedTokensResult.supportTokenList);

  const [filterTokenList, setFilterTokenList] = useState(transferSupportedTokensResult.supportTokenList);

  const [tokenList, setTokenList] = useState(transferSupportedTokensResult.supportTokenList);

  const [loading, setLoading] = useState(false);

  const { flowAddress, aptosAddress, seiAddress, injAddress } = useNonEVMContext();

  const sortExclusiveTokenSymbols = ["USDT", "USDC", "ETH", "WETH"];

  useEffect(() => {
    updateTokenListBalance();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transferSupportedTokensResult, address, provider, flowAddress, aptosAddress, seiAddress, injAddress, chainId]);

  const updateTokenListBalance = useMemo(
    () =>
      debounce(async () => {
        if (transferSupportedTokensResult.fromChainId !== fromChain?.id) {
          return;
        }

        const fromChainNonEVMMode = getNonEVMMode(transferSupportedTokensResult.fromChainId);

        switch (fromChainNonEVMMode) {
          case NonEVMMode.flowMainnet:
          case NonEVMMode.flowTest: {
            await getFlowTokenListBalance(flowAddress, transferSupportedTokensResult);
            break;
          }
          case NonEVMMode.aptosMainnet:
          case NonEVMMode.aptosTest:
          case NonEVMMode.aptosDevnet: {
            await getAptosTokenListBalance(aptosAddress, transferSupportedTokensResult);
            break;
          }
          case NonEVMMode.seiMainnet:
          case NonEVMMode.seiDevnet:
          case NonEVMMode.seiTestnet: {
            await getSeiTokenListBalance(seiAddress, transferSupportedTokensResult);
            break;
          }
          case NonEVMMode.injectiveTestnet:
          case NonEVMMode.injectiveMainnet: {
            await getInjTokenListBalance(injAddress, transferSupportedTokensResult);
            break;
          }
          case NonEVMMode.off: {
            break;
          }
          default: {
            console.error("Unsupported NonEVM mode", fromChainNonEVMMode);
          }
        }
      }, 300),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      transferSupportedTokensResult,
      address,
      provider,
      pegConfig,
      seiAddress,
      injAddress,
      flowAddress,
      aptosAddress,
      chainId,
      fromChain?.id,
    ],
  );

  const getFlowTokenListBalance = async (localFlowAddress: string, result: SupportTokenListResult) => {
    const supportedTokenList = result.supportTokenList;
    if (!localFlowAddress) {
      addBalancePlaceHolderForTokenList(supportedTokenList);
      return;
    }

    const promiseList: Array<Promise<TokenInfo>> = [];
    supportedTokenList.forEach(tokenInfo => {
      const flowTokenPath = flowTokenPathConfigs.find(config => {
        return config.Symbol === tokenInfo.token.symbol;
      });

      const getFlowBalancePromise = checkTokenBalanceForFlowAccount(localFlowAddress, flowTokenPath?.BalancePath ?? "")
        .then(balance => {
          return {
            ...tokenInfo,
            balance: formatDecimalPart(`${balance}`, 6, "floor", true),
          };
        })
        .catch(_ => {
          return {
            ...tokenInfo,
            balance: "--",
          };
        });
      promiseList.push(getFlowBalancePromise);
    });

    setLoading(true);
    const balanceList = await Promise.all(promiseList);

    setLoading(false);

    setTokenListWithBalance(balanceList);
  };

  const getAptosTokenListBalance = async (localAptosAddress: string, result: SupportTokenListResult) => {
    const supportedTokenList = result.supportTokenList;
    if (!localAptosAddress) {
      addBalancePlaceHolderForTokenList(supportedTokenList);
      return;
    }

    const promiseList: Array<Promise<TokenInfo>> = [];

    setLoading(true);
    getAptosResources(localAptosAddress)
      .then(resources => {
        supportedTokenList.forEach(tokenInfo => {
          if (!resources) {
            promiseList.push(
              Promise.resolve({
                ...tokenInfo,
                balance: "--",
              }),
            );
            return;
          }
          const typeTag = `0x1::coin::CoinStore<${tokenInfo.token.address}>`;
          const resource = resources.find(r => r.type === typeTag);
          if (!resource) {
            promiseList.push(
              Promise.resolve({
                ...tokenInfo,
                balance: "--",
              }),
            );
            return;
          }
          // eslint-disable-next-line
          const balance = (resource?.data as any).coin.value / 10 ** tokenInfo.token.decimal;
          promiseList.push(
            Promise.resolve({
              ...tokenInfo,
              balance: formatDecimalPart(`${balance}`, 6, "floor", true),
            }),
          );
        });
        return Promise.all(promiseList);
      })
      .then(balanceList => {
        setLoading(false);
        setTokenListWithBalance(balanceList);
      })
      .catch(_ => {
        setLoading(false);
        setTokenListWithBalance(
          supportedTokenList.map(tokenInfo => {
            return {
              ...tokenInfo,
              balance: "--",
            };
          }),
        );
      });
  };

  const getSeiTokenListBalance = async (localSeiAddress: string, result: SupportTokenListResult) => {
    const supportedTokenList = result.supportTokenList;
    if (!localSeiAddress) {
      addBalancePlaceHolderForTokenList(supportedTokenList);
      return;
    }

    const promiseList: Array<Promise<TokenInfo>> = [];

    supportedTokenList.forEach(tokenInfo => {
      if (isGasToken(fromChain?.id || 1, tokenInfo.token.symbol)) {
        const getSeiBalancePromise = getSeiNativeTokenBalance(localSeiAddress, tokenInfo.token)
          .then(res => {
            if (res !== undefined) {
              return {
                ...tokenInfo,
                balance: formatDecimalPart(`${res}`, 18, "floor", true),
              };
            }
            return {
              ...tokenInfo,
              balance: "--",
            };
          })
          .catch(_ => {
            return {
              ...tokenInfo,
              balance: "--",
            };
          });
        promiseList.push(getSeiBalancePromise);
      } else {
        const getSeiBalancePromise = getSeiTokenBalance(tokenInfo.token, localSeiAddress)
          .then(res => {
            if (res !== undefined) {
              return {
                ...tokenInfo,
                balance: formatDecimalPart(`${res}`, 6, "floor", true),
              };
            }
            return {
              ...tokenInfo,
              balance: "--",
            };
          })
          .catch(_ => {
            return {
              ...tokenInfo,
              balance: "--",
            };
          });
        promiseList.push(getSeiBalancePromise);
      }
    });

    setLoading(true);
    const balanceList = await Promise.all(promiseList);

    setLoading(false);

    setTokenListWithBalance(balanceList);
  };

  const getInjTokenListBalance = async (localSeiAddress: string, result: SupportTokenListResult) => {
    const supportedTokenList = result.supportTokenList;
    if (!localSeiAddress) {
      addBalancePlaceHolderForTokenList(supportedTokenList);
      return;
    }

    const promiseList: Array<Promise<TokenInfo>> = [];

    supportedTokenList.forEach(tokenInfo => {
      if (isGasToken(fromChain?.id || 1, tokenInfo.token.symbol)) {
        const getSeiBalancePromise = getInjNativeTokenBalance(localSeiAddress, tokenInfo.token)
          .then(res => {
            if (res !== undefined) {
              return {
                ...tokenInfo,
                balance: formatDecimalPart(`${res}`, 18, "floor", true),
              };
            }
            return {
              ...tokenInfo,
              balance: "--",
            };
          })
          .catch(_ => {
            return {
              ...tokenInfo,
              balance: "--",
            };
          });
        promiseList.push(getSeiBalancePromise);
      } else {
        const getSeiBalancePromise = getInjTokenBalance(tokenInfo.token, localSeiAddress)
          .then(res => {
            if (res !== undefined) {
              return {
                ...tokenInfo,
                balance: formatDecimalPart(`${res}`, 6, "floor", true),
              };
            }
            return {
              ...tokenInfo,
              balance: "--",
            };
          })
          .catch(_ => {
            return {
              ...tokenInfo,
              balance: "--",
            };
          });
        promiseList.push(getSeiBalancePromise);
      }
    });

    setLoading(true);
    const balanceList = await Promise.all(promiseList);

    setLoading(false);

    setTokenListWithBalance(balanceList);
  };

  const addBalancePlaceHolderForTokenList = (supportedTokenList: TokenInfo[]) => {
    const balanceList = supportedTokenList.map(tokenInfo => {
      return {
        ...tokenInfo,
        balance: "--",
      };
    });

    setTokenListWithBalance(balanceList);
  };

  const onInputChange = e => {
    setSearchText(e.target.value?.toLowerCase());
  };
  const onEnter = e => {
    setSearchText(e.target.value?.toLowerCase());
  };

  useEffect(() => {
    if (!fromChain) {
      return;
    }

    const sortedTokenList = sortTokenList(tokenListWithBalance);
    sortedTokenList.sort((a, b) =>
      Number(a.balance?.split(",").join("")) > Number(b.balance?.split(",").join("")) ? -1 : 1,
    );
    setFilterTokenList(sortedTokenList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenListWithBalance]);

  useEffect(() => {
    if (!fromChain) {
      return;
    }
    const list = filterTokenList?.filter(item => {
      const chainNameFeatch = item.name.toLowerCase().indexOf(searchText) > -1;
      const addressFeatch = item.token.address.toString().toLowerCase().indexOf(searchText) > -1;
      const symbolFeatch = item.token.symbol.toString().toLowerCase().indexOf(searchText) > -1;
      const isFilter = chainNameFeatch || addressFeatch || symbolFeatch;
      return isFilter;
    });

    setTokenList(list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, filterTokenList]);

  const sortTokenList = (list: TokenInfo[]) => {
    // split hardToken and normalToken
    const highPriorityTokenList: TokenInfo[] = [];
    const normalTokenList: TokenInfo[] = [];

    list.forEach(item => {
      if (sortExclusiveTokenSymbols.includes(item.token.symbol)) {
        highPriorityTokenList.push(item);
      } else {
        normalTokenList.push(item);
      }
    });
    // sort hardToken
    const sortedHighPriorityTokenList: TokenInfo[] = [];
    sortExclusiveTokenSymbols.forEach(symbol => {
      const targetToken = highPriorityTokenList.find(
        item => item.token.symbol === symbol || item.token.display_symbol === symbol,
      );
      if (targetToken && !sortedHighPriorityTokenList.includes(targetToken)) {
        sortedHighPriorityTokenList.push(targetToken);
      }
    });

    // sort normalToken
    const sortedNormalTokenList: TokenInfo[] = normalTokenList.sort((a, b) => {
      if (a.token.symbol < b.token.symbol) {
        return -1;
      }
      if (a.token.symbol > b.token.symbol) {
        return 1;
      }
      return 0;
    });
    const result = sortedHighPriorityTokenList.concat(sortedNormalTokenList) as Array<TokenInfo>;
    return result;
  };

  const handleCloseModal = () => {
    setSearchText("");
    onCancel();
  };

  return (
    <Modal
      onCancel={handleCloseModal}
      visible={visible}
      footer={null}
      maskClosable={false}
      className={classes.tokenModal}
      title="Select a token"
    >
      <Spin spinning={loading} wrapperClassName="tokenSpin">
        <div className={classes.card}>
          <div className={classes.search}>
            <Input
              className={classes.searchinput}
              placeholder="Search token by name or address"
              value={searchText}
              onChange={onInputChange}
              onPressEnter={onEnter}
              allowClear
              autoFocus={!isMobile}
            />
          </div>
          <div className={classes.moreOptionNote}>
            <img src={ringBell} className={classes.moreOptionIcon} alt="moreOptionNoteIcon" />
            <span style={{ color: "#8F9BB3", fontSize: 14, paddingLeft: 4, paddingRight: 4 }}>
              Below is the supported token list from {fromChain?.name} to {toChain?.name}.{" "}
              <span style={{ color: "#8F9BB3", fontSize: 14, fontWeight: 700 }}>More tokens</span> can be found if you
              select other chains.
            </span>
          </div>
          <div className={classes.itemList}>
            {tokenList?.map((item, index) => {
              return (
                <TokenItem
                  // eslint-disable-next-line
                  key={`${item?.token?.symbol}-${item?.token?.display_symbol}-${index}`}
                  onSelectToken={onSelectToken}
                  tokenInfo={item}
                />
              );
            })}
            {tokenList?.length === 0 && (
              <div style={{ width: "100%", fontSize: 16, textAlign: "center", color: "#fff" }}>No results found.</div>
            )}
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default NonEVMChainTokenList;
