import { Input, Modal, Spin } from "antd";
import { FC, useState, useEffect, useMemo } from "react";
import { createUseStyles } from "react-jss";
import { debounce } from "lodash";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ContractCallContext, ContractCallResults, Multicall } from "ethereum-multicall";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { useAppSelector } from "../../redux/store";
import { Theme } from "../../theme";
import TokenItem from "./TokenItem";

// import { useMergedTokenList } from "../../hooks/useMergedTokenList";
import { ensureSigner } from "../../hooks/contractLoader";
import { usePeggedPairConfig } from "../../hooks/usePeggedPairConfig";
import { TokenInfo } from "../../constants/type";
import { ERC20__factory } from "../../typechain/typechain/factories/ERC20__factory";
import { formatDecimal } from "../../helpers/format";
import { SupportTokenListResult, useTransferSupportedTokenList } from "../../hooks/transferSupportedInfoList";
import ringBell from "../../images/ringBell.svg";
import { getNonEVMMode, NonEVMMode, useNonEVMContext } from "../../providers/NonEVMContextProvider";
import { isGasToken } from "../../constants/network";

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

const multiCallSupportChains = [
  1, 3, 4, 5, 10, 42, 137, 69, 100, 420, 42161, 421611, 421613, 80001, 11155111, 43114, 43113, 4002, 250, 56, 97, 1284,
  1285, 1287, 1666600000, 25, 122, 19, 16, 288, 1313161554, 592, 66, 128, 1088, 30, 31, 9001, 9000, 108, 18, 26863,
  42220, 71402, 71401, 8217, 2001, 321, 111,
];

const erc20ABI = [
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

interface IProps {
  onSelectToken: (symbol: string) => void;
  visible: boolean;
  onCancel: () => void;
}

const TokenList: FC<IProps> = ({ onSelectToken, visible, onCancel }) => {
  const { provider, address, chainId } = useWeb3Context();
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const { fromChain, toChain, transferConfig } = useAppSelector(state => state.transferInfo);

  const transferSupportedTokensResult = useTransferSupportedTokenList();

  // const { fromChainId, supportTokenList } = transferSupportedTokensResult;

  const [searchText, setSearchText] = useState("");
  const pegConfig = usePeggedPairConfig();

  const [tokenListWithBalance, setTokenListWithBalance] = useState(transferSupportedTokensResult.supportTokenList);

  const [filterTokenList, setFilterTokenList] = useState(transferSupportedTokensResult.supportTokenList);

  const [tokenList, setTokenList] = useState(transferSupportedTokensResult.supportTokenList);

  const [loading, setLoading] = useState(false);

  const { nonEVMAddress } = useNonEVMContext();

  const sortExclusiveTokenSymbols = ["USDT", "USDC", "ETH", "WETH"];

  useEffect(() => {
    updateTokenListBalance();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transferSupportedTokensResult, address, provider, nonEVMAddress, chainId]);

  const updateTokenListBalance = useMemo(
    () =>
      debounce(async () => {
        if (transferSupportedTokensResult.fromChainId !== fromChain?.id) {
          return;
        }

        const fromChainNonEVMMode = getNonEVMMode(transferSupportedTokensResult.fromChainId);

        switch (fromChainNonEVMMode) {
          case NonEVMMode.flowMainnet:
          case NonEVMMode.flowTest:
          case NonEVMMode.aptosMainnet:
          case NonEVMMode.aptosTest:
          case NonEVMMode.aptosDevnet:
          case NonEVMMode.seiMainnet:
          case NonEVMMode.seiDevnet:
          case NonEVMMode.seiTestnet:
          case NonEVMMode.injectiveTestnet:
          case NonEVMMode.injectiveMainnet: {
            break;
          }
          case NonEVMMode.off: {
            if (chainId !== transferSupportedTokensResult.fromChainId) {
              /// Don't get balance if metamask chain id and from chain id are different
              addBalancePlaceHolderForTokenList(transferSupportedTokensResult.supportTokenList);
            } else if (provider === undefined) {
              /// Don't get balance if provider is not ready
              console.debug("provider is not ready for balance");
              addBalancePlaceHolderForTokenList(transferSupportedTokensResult.supportTokenList);
            } else if (!address) {
              /// Don't get balance if address is not ready
              console.debug("address is not ready for balance");
              addBalancePlaceHolderForTokenList(transferSupportedTokensResult.supportTokenList);
            } else {
              await getEVMTokenListBalance(provider, address, transferSupportedTokensResult);
            }
            break;
          }
          default: {
            console.error("Unsupported NonEVM mode", fromChainNonEVMMode);
          }
        }
      }, 300),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transferSupportedTokensResult, address, provider, pegConfig, nonEVMAddress, chainId, fromChain?.id],
  );

  // aggregate to get all tokens balance
  const multicallERC20Balances = async (supportTokenList: TokenInfo[], jsonProvider: JsonRpcProvider) => {
    const multicall = new Multicall({ ethersProvider: jsonProvider, tryAggregate: true });
    const balanceContractContext: ContractCallContext[] = [];

    supportTokenList.forEach((token, index) => {
      const contractCallContext: ContractCallContext = {
        reference: "ERC20Contract" + index,
        contractAddress: token.token.address,
        abi: erc20ABI,
        calls: [{ reference: "balanceOf", methodName: "balanceOf", methodParameters: [address] }],
      };
      balanceContractContext.push(contractCallContext);
    });

    const multiCallResults: ContractCallResults = await multicall.call(balanceContractContext);
    // eslint-disable-next-line
    const balanceList = new Array<any>();
    supportTokenList.forEach(tokenInfo => {
      Object.entries(multiCallResults.results).forEach(multiCallResult => {
        if (multiCallResult[1].originalContractCallContext.contractAddress === tokenInfo.token.address) {
          if (multiCallResult[1].callsReturnContext[0].success) {
            const balanceInfo = multiCallResult[1].callsReturnContext[0].returnValues[0];
            const { hex } = balanceInfo;
            balanceList.push({
              ...tokenInfo,
              balance: formatDecimal(hex, tokenInfo?.token?.decimal),
            });
          } else {
            balanceList.push({
              ...tokenInfo,
              balance: "--",
            });
          }
        }
      });
    });
    return balanceList;
  };

  // get an native token balance
  const getNativeTokenBalance = async (userAddress: string, tokenInfo: TokenInfo, jsonProvider: JsonRpcProvider) => {
    try {
      const nativeTokenBalance = await jsonProvider.getBalance(userAddress);
      return {
        ...tokenInfo,
        balance: formatDecimal(nativeTokenBalance.toString(), tokenInfo?.token?.decimal),
      };
    } catch (e) {
      return {
        ...tokenInfo,
        balance: "--",
      };
    }
  };

  // get an erc20 balance
  const getERC20TokenBalance = async (
    userAddress: string,
    tokenChainId: number,
    tokenContractAddr: string,
    tokenInfo: TokenInfo,
    jsonProvider: JsonRpcProvider,
  ) => {
    const tokenContract = await ERC20__factory.connect(tokenContractAddr, jsonProvider);

    let overrides = {};

    // fix nervos chain can't get balance who has not register the L2 account,
    // error: from id not found by from address:xx have you deposited?
    if (tokenChainId === 71402) {
      overrides = { from: "0x9FEaB89C449C90282c93D0b532029eFA72eA00c8" };
    }

    try {
      const balance = await tokenContract.balanceOf(userAddress, overrides);
      return {
        ...tokenInfo,
        balance: formatDecimal(balance.toString(), tokenInfo?.token?.decimal),
      };
    } catch (e) {
      console.error(e);
      return {
        ...tokenInfo,
        balance: "--",
      };
    }
  };

  const getEVMTokenListBalance = async (
    jsProvider: JsonRpcProvider,
    walletAddress: string,
    result: SupportTokenListResult,
  ) => {
    const signer = await ensureSigner(jsProvider);
    if (!signer || !chainId) {
      /// Don't get balance if singer is not ready
      console.debug("signer is not ready for balance");
      addBalancePlaceHolderForTokenList(result.supportTokenList);
      return;
    }

    if (multiCallSupportChains.includes(chainId)) {
      console.debug("get erc20 token balance via multi-call");
      setLoading(true);
      const balanceList = await multicallERC20Balances(result.supportTokenList, jsProvider);
      const nativeToken = result.supportTokenList.find(_ =>
        isGasToken(result.fromChainId, _.token.display_symbol ?? _.token.symbol),
      );
      if (nativeToken) {
        const nativeTokenBalance = await getNativeTokenBalance(address, nativeToken, jsProvider);
        balanceList.map(_ => {
          if (isGasToken(chainId, _.token.display_symbol ?? _.token.symbol)) {
            _.balance = nativeTokenBalance.balance;
          }
          return _;
        });
      }
      setTokenListWithBalance(balanceList);
      setLoading(false);
      return;
    }

    console.debug("get erc20 token balance one by one");

    const promiseList: Array<Promise<TokenInfo>> = [];
    result.supportTokenList.forEach(tokenInfo => {
      const tokenIsNativeToken = isNativeToken(
        tokenInfo.token.symbol,
        tokenInfo.token.display_symbol ?? "",
        result.fromChainId,
      );
      if (tokenIsNativeToken) {
        promiseList.push(getNativeTokenBalance(walletAddress, tokenInfo, jsProvider));
      } else {
        const tokenFinalAddress = pegConfig?.getTokenBalanceAddress(
          tokenInfo.token.address || "",
          result.fromChainId,
          tokenInfo.token.symbol,
          transferConfig.pegged_pair_configs,
        );
        promiseList.push(
          getERC20TokenBalance(walletAddress, result.fromChainId, tokenFinalAddress, tokenInfo, jsProvider),
        );
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

  const isNativeToken = (tokenSymbol: string, tokenDisplaySymbol: string, targetChainId: number): boolean => {
    const ethSupportedChainIds: number[] = [
      1, // Ethereum
      42161, // Arbitrum
      10, // Optimism
      5, // Goerli
      288, // BOBA,
      42170, // Arbitrum Nova
    ];

    if (tokenDisplaySymbol === "ETH" && ethSupportedChainIds.includes(targetChainId)) {
      return true;
    }

    if (isGasToken(targetChainId, tokenSymbol)) {
      return true;
    }

    return false;
  };

  const onInputChange = e => {
    setSearchText(e.target.value);
  };
  const onEnter = e => {
    setSearchText(e.target.value);
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
      const chainNameFeatch = item.name.toLowerCase().indexOf(searchText?.toLowerCase()) > -1;
      const addressFeatch = item.token.address.toString().toLowerCase().indexOf(searchText?.toLowerCase()) > -1;
      const symbolFeatch = item.token.symbol.toString().toLowerCase().indexOf(searchText?.toLowerCase()) > -1;
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

export default TokenList;
