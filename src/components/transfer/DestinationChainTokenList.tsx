import { Avatar, Modal, Spin } from "antd";
import { FC, useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import { StaticJsonRpcProvider } from "@ethersproject/providers";

import { ContractCallContext, ContractCallResults, Multicall } from "ethereum-multicall";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { useAppSelector } from "../../redux/store";
import { Theme } from "../../theme";

import { TokenInfo } from "../../constants/type";
import { formatDecimal } from "../../helpers/format";
import { useDestinationChainTokenList } from "../../hooks/useDestinationChainTokenList";
import JumpIcon from "../../images/jumpToOtherPage.svg";
import { getTokenListSymbol } from "../../redux/transferSlice";
import { isETH } from "../../helpers/tokenInfo";
import { storageConstants } from "../../constants/const";

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
  onSelectToken: (tokenInfo: TokenInfo) => void;
  visible: boolean;
  onCancel: () => void;
  selectedToken: TokenInfo | undefined;
}

const DestinationChainTokenList: FC<IProps> = ({ onSelectToken, visible, onCancel, selectedToken }) => {
  const { address, getNetworkById } = useWeb3Context();
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const destinationChainTokenList = useDestinationChainTokenList();
  const [tokenListWithBalance, setTokenListWithBalance] = useState<TokenInfo[]>(destinationChainTokenList);

  const [loading, setLoading] = useState(false);

  const addBalancePlaceHolderForTokenList = (supportedTokenList: TokenInfo[]) => {
    const balanceList = supportedTokenList.map(tokenInfo => {
      return {
        ...tokenInfo,
        balance: "--",
      };
    });

    setTokenListWithBalance(balanceList);
  };

  useEffect(() => {
    // aggregate to get all tokens balance
    const multicallERC20Balances = async (
      supportTokenList: TokenInfo[],
      jsonProvider: StaticJsonRpcProvider,
      walletAddress: string,
    ) => {
      const multicall = new Multicall({ ethersProvider: jsonProvider, tryAggregate: true });
      const balanceContractContext: ContractCallContext[] = [];

      supportTokenList?.forEach((token, index) => {
        const contractCallContext: ContractCallContext = {
          reference: "ERC20Contract" + index,
          contractAddress: token.token.address,
          abi: erc20ABI,
          calls: [{ reference: "balanceOf", methodName: "balanceOf", methodParameters: [walletAddress] }],
        };
        balanceContractContext.push(contractCallContext);
      });

      const multiCallResults: ContractCallResults = await multicall.call(balanceContractContext);
      // eslint-disable-next-line
      const balanceList = new Array<any>();
      supportTokenList?.forEach(tokenInfo => {
        Object.entries(multiCallResults.results)?.forEach(multiCallResult => {
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

    const getEVMTokenListBalance = async (walletAddress: string) => {
      const multiCallSupportChains = [
        1, 3, 4, 5, 10, 42, 137, 69, 100, 420, 42161, 421611, 421613, 80001, 11155111, 43114, 43113, 4002, 250, 56, 97,
        1284, 1285, 1287, 1666600000, 25, 122, 19, 16, 288, 1313161554, 592, 66, 128, 1088, 30, 31, 9001, 9000, 108, 18,
        26863, 42220, 71402, 71401, 8217, 2001, 321, 111,
      ];
      if (destinationChainTokenList.length === 0) {
        return;
      }

      if (!multiCallSupportChains.includes(destinationChainTokenList[0].token.chainId)) {
        return;
      }

      const jsonPRCProvider = new StaticJsonRpcProvider(
        getNetworkById(destinationChainTokenList[0].token.chainId).rpcUrl,
      );
      setLoading(true);
      const balanceList = await multicallERC20Balances(destinationChainTokenList, jsonPRCProvider, walletAddress);

      let chainId = 0;
      if (destinationChainTokenList.length > 0) {
        chainId = destinationChainTokenList[0].token.chainId;
      }

      if (
        sessionStorage.getItem(storageConstants.KEY_DESTINATION_TOKEN_LIST_UPDATE) ===
        chainId + "" + destinationChainTokenList.length
      ) {
        setTokenListWithBalance(balanceList);
        setLoading(false);
      }
    };

    const updateTokenListBalance = async () => {
      let chainId = 0;
      if (destinationChainTokenList.length > 0) {
        chainId = destinationChainTokenList[0].token.chainId;
      }

      sessionStorage.setItem(
        storageConstants.KEY_DESTINATION_TOKEN_LIST_UPDATE,
        chainId + "" + destinationChainTokenList.length,
      );
      if (!address) {
        addBalancePlaceHolderForTokenList(destinationChainTokenList);
      } else {
        await getEVMTokenListBalance(address);
      }
    };

    updateTokenListBalance();
  }, [address, destinationChainTokenList, getNetworkById]);

  const handleCloseModal = () => {
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
          <div className={classes.itemList}>
            {tokenListWithBalance?.map((item, index) => {
              return (
                <TokenItemForDestinationChain
                  // eslint-disable-next-line
                  key={`${item?.token?.symbol}-${isETH(item.token) ? "ETH" : ""}-${index}`}
                  onSelectToken={() => {
                    onSelectToken(item);
                  }}
                  tokenInfo={item}
                  isSelected={item.token.address === selectedToken?.token.address}
                />
              );
            })}
            {tokenListWithBalance?.length === 0 && (
              <div style={{ width: "100%", fontSize: 16, textAlign: "center", color: "#fff" }}>No results found.</div>
            )}
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

/* eslint-disable camelcase */
const useStylesForTokenItem = createUseStyles((theme: Theme) => ({
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

const TokenItemForDestinationChain = ({ onSelectToken, tokenInfo, isSelected }) => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const { toChain } = useAppSelector(state => state.transferInfo);
  const { getNetworkById } = useWeb3Context();
  const classes = useStylesForTokenItem();
  const { icon, token } = tokenInfo;
  const tokenBalance = tokenInfo.balance;

  const displaySymbol = (localTokenInfo: TokenInfo) => {
    return getTokenListSymbol(localTokenInfo.token.symbol, localTokenInfo.token.chainId);
  };

  const displayTokenName = (localTokenInfo: TokenInfo) => {
    return localTokenInfo.name;
  };
  return (
    <div
      className={isSelected ? classes.activeItem : classes.item}
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
          {/* eslint-disable-next-line  */}
          <img
            style={{ marginLeft: 8, width: 11, height: 11, color: "red", cursor: "pointer" }}
            src={JumpIcon}
            alt=""
            onClick={() => {
              window.open(getNetworkById(toChain?.id ?? 0).blockExplorerUrl + "/token/" + token.address);
            }}
          />
        </div>
        <div className={classes.tokenName} style={{ textAlign: isMobile ? "right" : "left" }}>
          {tokenBalance}{" "}
          <span className="tokenSymbolName" style={{ marginLeft: 5 }}>
            {displaySymbol(tokenInfo)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DestinationChainTokenList;
