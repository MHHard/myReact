/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Chain,
  TokenInfo,
  GetTransferConfigsResponse,
  MultiBurnPairConfig,
  FlowTokenPathConfig,
  PeggedPairConfig,
  PriceOfTokens,
  TransferHistory,
  LPHistory,
} from "../constants/type";
import { EstimateAmtResponse, GetRfqConfigsResponse, CircleUsdcConfigResponse } from "../proto/gateway/gateway_pb";
import { kavaPegTokens, storageConstants } from "../constants/const";
import { PriceResponse } from "../proto/sdk/service/rfq/user_pb";
import { saveTokenSymbolIntoLocalStorage } from "../utils/saveSelectedTokenSymbolToLocalStorage";
import { ethSupportedChainIds } from "../helpers/tokenInfo";
import { GetPeggedMode, PeggedChainMode } from "../hooks/usePeggedPairConfig";

/* eslint-disable camelcase */
/* eslint-disable no-debugger */
interface TransferIState {
  transferConfig: GetTransferConfigsResponse;
  rfqConfig: GetRfqConfigsResponse.AsObject;
  circleUSDCConfig: CircleUsdcConfigResponse.AsObject;
  supportTransferChains: Array<number>;
  slippageTolerance: number;
  isChainShow: boolean;
  chainSource: string;
  fromChainId: number;
  toChainId: number;
  tokenList: Array<TokenInfo>;
  fromChain?: Chain;
  toChain?: Chain;
  selectedToken?: TokenInfo;
  selectedTokenSymbol?: string;
  totalActionNum: number;
  totalPaddingNum: number;
  estimateAmtInfoInState: EstimateAmtResponse.AsObject | null;
  priceResponse: PriceResponse.AsObject | null;
  rate: string;
  getConfigsFinish: boolean;
  refreshHistory: boolean;
  refreshTransferAndLiquidity: boolean;
  singleChainList: Array<any>;
  singleChainSelectIndex: number;
  singleChainRate: string;
  bigAmountDelayInfos: Array<BigAmountDelayInfo>;
  multiBurnConfigs: Array<MultiBurnPairConfig>;
  flowTokenPathConfigs: Array<FlowTokenPathConfig>;
  priceOfTokens: PriceOfTokens | undefined;
  isFromSEO: boolean;
  transferPendingList: TransferHistory[] | undefined;
  lpPendingList: LPHistory[] | undefined;
  historyActionNum: number;
  historyPendingNum: number;
  lpActionNum: number;
  lpPendingNum: number;
  disableTransferAddlqAggregatelqAction: boolean;
  disableTransferAddlqAggregatelqActionLoading: boolean;
}

const initialState: TransferIState = {
  transferConfig: {
    chains: [],
    chain_token: {},
    pegged_pair_configs: [],
    blocked_bridge_direct_list: [],
  },
  rfqConfig: {
    chaintokensList: [],
    rfqContractAddressesMap: [],
  },
  circleUSDCConfig: {
    chaintokensList: [],
  },
  supportTransferChains: [],
  slippageTolerance: 5000,
  isChainShow: false,
  chainSource: "form",
  fromChainId: 0,
  toChainId: 0,
  tokenList: [],
  selectedToken: undefined,
  selectedTokenSymbol: "",
  totalActionNum: 0,
  totalPaddingNum: 0,
  estimateAmtInfoInState: null,
  priceResponse: null,
  rate: localStorage.getItem(storageConstants.KEY_RATIO) || "1",
  getConfigsFinish: false,
  refreshHistory: false,
  refreshTransferAndLiquidity: false,
  fromChain: undefined,
  toChain: undefined,
  singleChainList: [],
  singleChainSelectIndex: 0,
  singleChainRate: "1",
  bigAmountDelayInfos: [],
  flowTokenPathConfigs: [],
  multiBurnConfigs: [],
  isFromSEO: false,
  priceOfTokens: {
    updateEpoch: "",
    assetPrice: [],
    gasPrice: [],
  },
  transferPendingList: [],
  lpPendingList: [],
  historyActionNum: 0,
  historyPendingNum: 0,
  lpActionNum: 0,
  lpPendingNum: 0,
  disableTransferAddlqAggregatelqAction: false,
  disableTransferAddlqAggregatelqActionLoading: false,
};

const transferSlice = createSlice({
  name: "lp",
  initialState,
  reducers: {
    setTransferConfig: (state, { payload }: PayloadAction<GetTransferConfigsResponse>) => {
      state.transferConfig = payload;
    },
    setSupportTransferChains: (state, { payload }: PayloadAction<number[]>) => {
      state.supportTransferChains = payload;
    },
    setMultiBurnConfigs: (state, { payload }: PayloadAction<Array<MultiBurnPairConfig>>) => {
      state.multiBurnConfigs = payload;
    },
    setRfqConfig: (state, { payload }: PayloadAction<GetRfqConfigsResponse.AsObject>) => {
      state.rfqConfig = payload;
    },
    setCircleUSDCConfig: (state, { payload }: PayloadAction<CircleUsdcConfigResponse.AsObject>) => {
      state.circleUSDCConfig = payload;
    },
    setSlippageTolerance: (state, { payload }: PayloadAction<number>) => {
      state.slippageTolerance = payload;
    },
    setIsChainShow: (state, { payload }: PayloadAction<boolean>) => {
      state.isChainShow = payload;
    },
    setChainSource: (state, { payload }: PayloadAction<string>) => {
      state.chainSource = payload;
    },
    setFromChainId: (state, { payload }: PayloadAction<number>) => {
      state.fromChainId = payload;
    },
    setToChainId: (state, { payload }: PayloadAction<number>) => {
      state.toChainId = payload;
    },
    setTokenList: (state, { payload }: PayloadAction<Array<TokenInfo>>) => {
      state.tokenList = payload;
    },
    setFromChain: (state, { payload }: PayloadAction<Chain>) => {
      localStorage.setItem(storageConstants.KEY_FROM_CHAIN_ID, JSON.stringify(payload?.id));
      state.fromChain = payload;
    },
    setToChain: (state, { payload }: PayloadAction<Chain>) => {
      localStorage.setItem(storageConstants.KEY_TO_CHAIN_ID, JSON.stringify(payload.id));
      state.toChain = payload;
    },
    setSelectedToken: (state, { payload }: PayloadAction<TokenInfo>) => {
      state.selectedToken = payload;
      saveTokenSymbolIntoLocalStorage(payload);
    },
    setSelectedTokenSymbol: (state, { payload }: PayloadAction<string>) => {
      state.selectedTokenSymbol = payload;
    },
    setTotalActionNum: (state, { payload }: PayloadAction<number>) => {
      state.totalActionNum = payload;
    },
    setTotalPendingNum: (state, { payload }: PayloadAction<number>) => {
      state.totalPaddingNum = payload;
    },
    setEstimateAmtInfoInState: (state, { payload }: PayloadAction<EstimateAmtResponse.AsObject | null>) => {
      state.estimateAmtInfoInState = payload;
    },
    setPriceResponse: (state, { payload }: PayloadAction<PriceResponse.AsObject | null>) => {
      state.priceResponse = payload;
    },
    setRate: (state, { payload }: PayloadAction<string>) => {
      localStorage.setItem(storageConstants.KEY_RATIO, payload);
      state.rate = payload;
    },
    setGetConfigsFinish: (state, { payload }: PayloadAction<boolean>) => {
      state.getConfigsFinish = payload;
    },
    setRefreshHistory: (state, { payload }: PayloadAction<boolean>) => {
      state.refreshHistory = payload;
    },
    setRefreshTransferAndLiquidity: (state, { payload }: PayloadAction<boolean>) => {
      state.refreshTransferAndLiquidity = payload;
    },
    setSingleChainList: (state, { payload }: PayloadAction<any>) => {
      state.singleChainList = payload;
    },
    setSingleChainSelectIndex: (state, { payload }: PayloadAction<number>) => {
      state.singleChainSelectIndex = payload;
    },
    setSingleChainRate: (state, { payload }: PayloadAction<string>) => {
      state.singleChainRate = payload;
    },
    setBigAmountDelayInfos: (state, { payload }: PayloadAction<Array<BigAmountDelayInfo>>) => {
      state.bigAmountDelayInfos = payload;
    },
    setFlowTokenPathConfigs: (state, { payload }: PayloadAction<Array<FlowTokenPathConfig>>) => {
      state.flowTokenPathConfigs = payload;
    },
    setIsFromSEO: (state, { payload }: PayloadAction<boolean>) => {
      state.isFromSEO = payload;
    },
    setPriceOfTokens: (state, { payload }: PayloadAction<PriceOfTokens>) => {
      state.priceOfTokens = payload;
    },
    setTransferPendingList: (state, { payload }: PayloadAction<TransferHistory[]>) => {
      state.transferPendingList = payload;
    },
    setLpPendingList: (state, { payload }: PayloadAction<LPHistory[]>) => {
      state.lpPendingList = payload;
    },
    setHistoryActionNum: (state, { payload }: PayloadAction<number>) => {
      state.historyActionNum = payload;
    },
    setHistoryPendingNum: (state, { payload }: PayloadAction<number>) => {
      state.historyPendingNum = payload;
    },
    setLpActionNum: (state, { payload }: PayloadAction<number>) => {
      state.lpActionNum = payload;
    },
    setLpPendingNum: (state, { payload }: PayloadAction<number>) => {
      state.lpPendingNum = payload;
    },
    setDisableTransferAddlqAggregatelqAction: (state, { payload }: PayloadAction<boolean>) => {
      state.disableTransferAddlqAggregatelqAction = payload;
    },
    setDisableTransferAddlqAggregatelqActionLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.disableTransferAddlqAggregatelqActionLoading = payload;
    },
  },
});

export const {
  setTransferConfig,
  setRfqConfig,
  setCircleUSDCConfig,
  setSlippageTolerance,
  setIsChainShow,
  setChainSource,
  setFromChainId,
  setToChainId,
  setTokenList,
  setFromChain,
  setToChain,
  setSelectedToken,
  setSelectedTokenSymbol,
  setTotalActionNum,
  setTotalPendingNum,
  setEstimateAmtInfoInState,
  setPriceResponse,
  setRate,
  setGetConfigsFinish,
  setRefreshHistory,
  setSingleChainList,
  setSingleChainSelectIndex,
  setSingleChainRate,
  setRefreshTransferAndLiquidity,
  setBigAmountDelayInfos,
  setFlowTokenPathConfigs,
  setIsFromSEO,
  setPriceOfTokens,
  setTransferPendingList,
  setLpPendingList,
  setHistoryActionNum,
  setHistoryPendingNum,
  setLpActionNum,
  setLpPendingNum,
  setDisableTransferAddlqAggregatelqAction,
  setDisableTransferAddlqAggregatelqActionLoading,
  setSupportTransferChains,
  setMultiBurnConfigs,
} = transferSlice.actions;

export default transferSlice.reducer;

interface SwitchChainSuccessCallback {
  (id: number): void;
}

export const switchChain = async (
  id,
  atoken,
  switchChainSuccessCallback: SwitchChainSuccessCallback,
  getNetworkById,
) => {
  const inId = Number(id);

  const providerName = localStorage.getItem(storageConstants.KEY_WEB3_PROVIDER_NAME);
  if (providerName && providerName === "walletconnect") {
    return;
  }

  try {
    if (window.clover) {
      const walletRpcUrl = getNetworkById(inId).walletRpcUrl ?? getNetworkById(inId).rpcUrl;
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${inId.toString(16)}`,
            rpcUrls: [walletRpcUrl],
            chainName: getNetworkById(inId).name,
            blockExplorerUrls: [getNetworkById(inId).blockExplorerUrl],
            nativeCurrency: {
              name: getNetworkById(inId).symbol,
              symbol: getNetworkById(inId).symbol, // 2-6 characters long
              decimals: 18,
            },
          },
        ],
      });
    } else {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${inId.toString(16)}` }],
      });
    }
    switchChainSuccessCallback(id);
    if (atoken) {
      localStorage.setItem(storageConstants.KEY_TO_ADD_TOKEN, JSON.stringify({ atoken, toId: inId }));
    }
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    // const message = (switchError.message as string) ?? "";
    // const testString = "Unrecognized chain ID";
    // || message.toLowerCase().includes(testString.toLowerCase())
    const errorCode = (switchError as { code: number }).code;
    if (errorCode === 4902 || errorCode === -32603) {
      try {
        const walletRpcUrl = getNetworkById(inId).walletRpcUrl ?? getNetworkById(inId).rpcUrl;
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${inId.toString(16)}`,
              rpcUrls: [walletRpcUrl],
              chainName: getNetworkById(inId).name,
              blockExplorerUrls: [getNetworkById(inId).blockExplorerUrl],
              nativeCurrency: {
                name: getNetworkById(inId).symbol,
                symbol: getNetworkById(inId).symbol, // 2-6 characters long
                decimals: 18,
              },
            },
          ],
        });
        switchChainSuccessCallback(id);
        if (atoken) {
          localStorage.setItem(storageConstants.KEY_TO_ADD_TOKEN, JSON.stringify({ atoken, toId: id }));
        }
      } catch (addError) {
        // handle "add" error
      }
    }
    // handle other "switch" errors
  }
};

export const addChainToken = async addtoken => {
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    localStorage.setItem(storageConstants.KEY_TO_ADD_TOKEN, "");
    await (window.ethereum as any).request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20", // Initially only supports ERC20, but eventually more!
        options: {
          address: addtoken.address, // The address that the token is at.
          symbol: addtoken.symbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: addtoken.decimals, // The number of decimals in the token
          image: addtoken.image, // A string url of the token logo
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export interface BigAmountDelayInfo {
  rpcUrl: string;
  contractAddress: string;
  tokenAddress: string;
  period: string;
  thresholds: string;
}
export const getTokenSymbolWithAddress = (
  tokenSymbol: string,
  tokenAddress: string,
  chainId: number,
  circleUSDCAddress: string,
) => {
  if (tokenSymbol === "USDC") {
    if (chainId === 43114) {
      return tokenAddress === circleUSDCAddress ? "USDC" : "USDC.e";
    }
    if (chainId === 43113) {
      return tokenAddress === circleUSDCAddress ? "USDC" : "USDC.e";
    }
    if (chainId === 42161) {
      return tokenAddress === circleUSDCAddress ? "USDC" : "USDC.e";
    }
    if (chainId === 421613) {
      return tokenAddress === circleUSDCAddress ? "USDC" : "USDC.e";
    }
  }

  return getTokenSymbol(tokenSymbol, chainId);
};

export const getTokenSymbol = (symbol, chId) => {
  let name = getTokenListSymbol(symbol, chId);
  // if dst chain are these, convert WETH to ETH
  if (ethSupportedChainIds?.includes(chId)) {
    if (symbol === "WETH") {
      name = "ETH";
    }
  }
  return name;
};

export const getTokenListSymbol = (symbol, chId) => {
  let name = symbol;
  const chainId = Number(chId);
  if (chainId === 43114) {
    // 43114
    if (symbol === "USDT") {
      name = "USDT.e";
    }
    if (symbol === "DAI") {
      name = "DAI.e";
    }
    if (symbol === "USDC") {
      name = "USDC.e";
    }
    if (symbol === "WETH") {
      name = "WETH.e";
    }
    if (symbol === "IMX") {
      name = "IMX.a";
    }
    if (symbol === "WOO") {
      name = "WOO.e";
    }
    if (symbol === "avaxUSDC") {
      name = "USDC";
    }
  }
  if (chainId === 250) {
    if (symbol === "USDT") {
      name = "fUSDT";
    }
    if (symbol === "WETH") {
      name = "ETH";
    }
  }
  if (chainId === 56) {
    if (symbol === "WETH") {
      name = "ETH";
    }
  }
  if (chainId === 1666600000) {
    if (symbol === "WETH") {
      name = "ETH";
    }
  }

  if (chainId === 42220) {
    if (symbol === "USDC") {
      name = "openUSDC";
    }
    if (symbol === "USDT") {
      name = "openUSDT";
    }
    if (symbol === "WETH") {
      name = "openWETH";
    }
  }

  if (chainId === 42262) {
    if (symbol === "USDC") {
      name = "ceUSDC";
    }
    if (symbol === "USDT") {
      name = "ceUSDT";
    }
    if (symbol === "WETH") {
      name = "ceWETH";
    }
    if (symbol === "BNB") {
      name = "cbBNB";
    }
    if (symbol === "AVAX") {
      name = "caAVAX";
    }
    if (symbol === "FTM") {
      name = "cfFTM";
    }
    if (symbol === "DAI") {
      name = "ceDAI";
    }
  }

  if (chainId === 1284) {
    if (symbol === "USDC") {
      name = "ceUSDC";
    }
    if (symbol === "USDT") {
      name = "ceUSDT";
    }
  }

  if (chainId === 1 || chainId === 56) {
    if (symbol === "SYS") {
      name = "WSYS";
    }
  }

  if (chainId === 9001) {
    if (symbol === "WETH") {
      name = "ceWETH";
    }

    if (symbol === "USDC") {
      name = "ceUSDC";
    }

    if (symbol === "USDT") {
      name = "ceUSDT";
    }

    if (symbol === "DAI") {
      name = "ceDAI";
    }

    if (symbol === "WBTC") {
      name = "ceWBTC";
    }

    if (symbol === "BNB") {
      name = "ceBNB";
    }

    if (symbol === "BUSD") {
      name = "ceBUSD";
    }

    if (symbol === "AVAX") {
      name = "ceAVAX";
    }

    if (symbol === "FTM") {
      name = "ceFTM";
    }

    if (symbol === "AURORA") {
      name = "ceAURORA";
    }

    if (symbol === "FTM") {
      name = "ceFTM";
    }
  }

  if (chainId === 12340001) {
    if (symbol === "AVAX") {
      name = "ceAVAX";
    }

    if (symbol === "BNB") {
      name = "ceBNB";
    }

    if (symbol === "BUSD") {
      name = "ceBUSD";
    }

    if (symbol === "DAI") {
      name = "ceDAI";
    }

    if (symbol === "FTM") {
      name = "ceFTM";
    }

    if (symbol === "MATIC") {
      name = "ceMATIC";
    }

    if (symbol === "USDT") {
      name = "ceUSDT";
    }

    if (symbol === "WBTC") {
      name = "ceWBTC";
    }

    if (symbol === "WETH") {
      name = "ceWETH";
    }
  }

  if (chainId === 73772) {
    if (symbol === "TUS") {
      name = "WTUS";
    }
    if (symbol === "avaxUSDC") {
      name = "USDC";
    }
  }

  if (chainId === 12340002) {
    if (symbol === "FLOWUSDC") {
      name = "USDC";
    }
  }

  if (chainId === 80001) {
    if (symbol === "FLOWUSDC") {
      name = "USDC";
    }
  }
  if (chainId === 12340001) {
    if (symbol === "cfUSDC") {
      name = "USDC";
    }
    if (symbol === "celrWFLOW") {
      name = "Flow";
    }
  }

  if (chainId === 1) {
    if (symbol === "cfUSDC") {
      name = "USDC";
    }

    if (symbol === "celrWFLOW") {
      name = "WFLOW";
    }

    if (symbol === "WING") {
      name = "pWING";
    }
  }

  if (chainId === 58) {
    if (symbol === "WETH") {
      name = "ETH";
    }
  }

  if (chainId === 8217) {
    if (symbol === "USDC") {
      name = "ceUSDC";
    }
    if (symbol === "USDT") {
      name = "ceUSDT";
    }
    if (symbol === "DAI") {
      name = "ceDAI";
    }
    if (symbol === "WBTC") {
      name = "ceWBTC";
    }
    if (symbol === "WETH") {
      name = "ceWETH";
    }
  }

  if (chainId === 592) {
    if (symbol === "USDC") {
      name = "ceUSDC";
    }

    if (symbol === "USDT") {
      name = "ceUSDT";
    }
  }

  if (chainId === 2222) {
    if (kavaPegTokens.includes(symbol)) {
      name = "ce" + name;
    }
  }

  /// Local defined symbol for cirlce USDC
  if (symbol === "USDC_CIRCLE") {
    name = "USDC";
  }

  /// Differ USDC.e and Circle USDC for Avalanchee, Avalanchee Fuji,
  if (chainId === 43113 || chainId === 43114) {
    if (symbol === "USDC") {
      name = "USDC.e";
    }
  }

  if (chainId === 42161 || chainId === 421613) {
    if (symbol === "USDC") {
      name = "USDC.e";
    }
  }

  return name;
};

export const getTokenSymbolWithPeggedMode = (
  fromChainId: number | undefined,
  toChainId: number | undefined,
  tokenSymbol: string,
  pegged_pair_configs: Array<PeggedPairConfig>,
) => {
  const peggedMode = GetPeggedMode(fromChainId, toChainId, tokenSymbol, pegged_pair_configs);
  if (peggedMode === PeggedChainMode.Off) {
    return getTokenSymbol(tokenSymbol, toChainId);
  }

  const vaultV2BurnForWETH = pegged_pair_configs.find(peggedPairConfig => {
    return (
      peggedPairConfig.org_chain_id === toChainId &&
      peggedPairConfig.pegged_chain_id === fromChainId &&
      peggedPairConfig.vault_version > 0 &&
      peggedPairConfig.org_token.token.symbol === tokenSymbol &&
      tokenSymbol === "WETH"
    );
  });

  if (vaultV2BurnForWETH) {
    return "ETH";
  }

  return getTokenListSymbol(tokenSymbol, toChainId);
};

export const getTxLink = (chainId: string | number, txLink: string, getNetworkById) => {
  if (!txLink) {
    return txLink;
  }
  try {
    if (chainId === 999999998) {
      const txhash = txLink?.split("/transaction/")[1].replace("0x", "").toUpperCase();
      return `${getNetworkById(chainId).blockExplorerUrl}transaction/${txhash}`;
    }

    if (chainId === 999999996) {
      const txhash = txLink?.split("transaction")[1].replace("0x", "").toUpperCase();
      return `${getNetworkById(chainId).blockExplorerUrl}/transaction${txhash}`;
    }

    return txLink;
  } catch (error) {
    console.error(error);
    return "";
  }
};
