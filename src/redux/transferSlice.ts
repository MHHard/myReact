/* eslint-disable camelcase */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getNetworkById } from "../constants/network";
import { storageConstants } from "../constants/const";

//   TokenInfo,
//   Chain,
//   ChainTokenInfo,
//   EstimateFeeResponse,
// } from "../proto/chainhop/web_pb";
import {
  ChainHopTokenInfo,
  GetTransferConfigsResponse,
} from "../constants/type";
import { Chain, Path, Token } from "../proto/chainhop/common_pb";
import { ErrMsg } from "../proto/chainhop/error_pb";

export interface TransferConfigIState {
  chains: Chain.AsObject[];
  chainToken: Record<string, ChainHopTokenInfo>;
}
export interface MyEstimateFeeResponse {
  key: string;
  estimateAmtInfoInState: Path.AsObject | null;
}

interface TransferIState {
  transferConfig: TransferConfigIState;
  isChainShow: boolean;
  chainSource: string;
  tokenSource: string;
  fromChainId: number;
  toChainId: number;
  srcTokenList: Array<Token.AsObject>;
  dstTokenList: Array<Token.AsObject>;
  fromChain?: Chain.AsObject;
  toChain?: Chain.AsObject;
  selectedToken?: Token.AsObject;
  selectedTokenSymbol?: string;
  estimateAmtInfoInWithKey: MyEstimateFeeResponse;
  bigAmountDelayInfos: Array<BigAmountDelayInfo>;
  homeLoading: boolean;
  tokenModalTitle: string;
  reloadTokenList: boolean;
  transferConfigForBridge: GetTransferConfigsResponse;
  quoteLoading: boolean;
  swapAmount: string;
  hasError: boolean;
  errorMsg: ErrMsg.AsObject | undefined;
}

const initialState: TransferIState = {
  transferConfig: {
    chains: [],
    chainToken: {},
  },
  isChainShow: false,
  chainSource: "from",
  tokenSource: "from",
  fromChainId: 0,
  toChainId: 0,
  srcTokenList: [],
  dstTokenList: [],
  selectedToken: undefined,
  selectedTokenSymbol: "",
  estimateAmtInfoInWithKey: { key: "", estimateAmtInfoInState: null },
  fromChain: undefined,
  toChain: undefined,
  bigAmountDelayInfos: [],
  homeLoading: false,
  tokenModalTitle: "Select a token",
  reloadTokenList: false,
  transferConfigForBridge: {
    chains: [],
    chain_token: {},
    pegged_pair_configs: [],
    farming_reward_contract_addr: "",
  },
  quoteLoading: false,
  swapAmount: "",
  hasError: false,
  errorMsg: {
    code: 0,
    msg: "",
  },
};

const transferSlice = createSlice({
  name: "lp",
  initialState,
  reducers: {
    setTransferConfig: (
      state,
      { payload }: PayloadAction<{ chains; chainToken }>
    ) => {
      state.transferConfig = payload;
    },
    setIsChainShow: (state, { payload }: PayloadAction<boolean>) => {
      state.isChainShow = payload;
    },
    setChainSource: (state, { payload }: PayloadAction<string>) => {
      state.chainSource = payload;
    },
    setTokenSource: (state, { payload }: PayloadAction<string>) => {
      state.tokenSource = payload;
    },
    setFromChainId: (state, { payload }: PayloadAction<number>) => {
      state.fromChainId = payload;
    },
    setToChainId: (state, { payload }: PayloadAction<number>) => {
      state.toChainId = payload;
    },
    setSrcTokenList: (
      state,
      { payload }: PayloadAction<Array<Token.AsObject>>
    ) => {
      state.srcTokenList = payload;
    },
    setDstTokenList: (
      state,
      { payload }: PayloadAction<Array<Token.AsObject>>
    ) => {
      state.dstTokenList = payload;
    },
    setFromChain: (state, { payload }: PayloadAction<Chain.AsObject>) => {
      localStorage.setItem(
        storageConstants.KEY_CHACHE_FROM_CHAIN_ID,
        JSON.stringify(payload?.chainId)
      );
      localStorage.setItem(
        storageConstants.KEY_CHACHE_FROM_CHAIN_INFO,
        JSON.stringify(payload)
      );
      state.fromChain = payload;
    },
    setToChain: (state, { payload }: PayloadAction<Chain.AsObject>) => {
      localStorage.setItem(
        storageConstants.KEY_TOCHAIN_ID,
        JSON.stringify(payload?.chainId)
      );
      state.toChain = payload;
    },
    setSelectedToken: (state, { payload }: PayloadAction<Token.AsObject>) => {
      state.selectedToken = payload;
      localStorage.setItem(
        storageConstants.KEY_SELECTED_TOKEN_SYMBOL,
        payload?.symbol || ""
      );
    },

    setEstimateAmtInfoInWithKey: (
      state,
      { payload }: PayloadAction<MyEstimateFeeResponse>
    ) => {
      state.estimateAmtInfoInWithKey = payload;
    },
    setBigAmountDelayInfos: (
      state,
      { payload }: PayloadAction<Array<BigAmountDelayInfo>>
    ) => {
      state.bigAmountDelayInfos = payload;
    },
    setHomeLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.homeLoading = payload;
    },
    setTokenModalTitle: (state, { payload }: PayloadAction<string>) => {
      state.tokenModalTitle = payload;
    },
    setReloadTokenList: (state) => {
      state.reloadTokenList = !state.reloadTokenList;
    },
    setTransferConfigForBridge: (
      state,
      { payload }: PayloadAction<GetTransferConfigsResponse>
    ) => {
      state.transferConfigForBridge = payload;
    },
    setQuoteLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.quoteLoading = payload;
    },
    setSwapAmount: (state, { payload }: PayloadAction<string>) => {
      state.swapAmount = payload;
    },
    setHasError: (state, { payload }: PayloadAction<boolean>) => {
      state.hasError = payload;
    },
    setErrorMsg: (
      state,
      { payload }: PayloadAction<ErrMsg.AsObject | undefined>
    ) => {
      state.errorMsg = payload;
    },
  },
});

export const {
  setTransferConfig,
  setIsChainShow,
  setChainSource,
  setFromChainId,
  setToChainId,
  setSrcTokenList,
  setDstTokenList,
  setFromChain,
  setToChain,
  setSelectedToken,
  setEstimateAmtInfoInWithKey,
  setTokenSource,
  setBigAmountDelayInfos,
  setHomeLoading,
  setTokenModalTitle,
  setReloadTokenList,
  setTransferConfigForBridge,
  setQuoteLoading,
  setSwapAmount,
  setHasError,
  setErrorMsg,
} = transferSlice.actions;

export default transferSlice.reducer;

interface SwitchChainSuccessCallback {
  (id: number): void;
}

export const switchChain = async (
  id,
  atoken,
  switchChainSuccessCallback?: SwitchChainSuccessCallback
) => {
  const inId = Number(id);

  const providerName = localStorage.getItem("web3providerName");
  if (providerName === "walletconnect" || !switchChainSuccessCallback) {
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${inId.toString(16)}` }],
    });
    if (atoken) {
      localStorage.setItem(
        storageConstants.KEY_TOKEN_NEED_ADD,
        JSON.stringify({ atoken, toId: inId })
      );
    }
    switchChainSuccessCallback(id);
    // localStorage.setItem(storageConstants.KEY_SELECTED_TOKEN_SYMBOL, "");
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    // const message = (switchError.message as string) ?? "";
    // const testString = "Unrecognized chain ID";
    // || message.toLowerCase().includes(testString.toLowerCase())
    if ((switchError as { code: number }).code === 4902) {
      try {
        const walletRpcUrl =
          getNetworkById(inId).walletRpcUrl ?? getNetworkById(inId).rpcUrl;
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
        if (atoken) {
          localStorage.setItem(
            storageConstants.KEY_TOKEN_NEED_ADD,
            JSON.stringify({ atoken, toId: id })
          );
        }
      } catch (addError) {
        // handle "add" error
      }
    }
    // handle other "switch" errors
  }
};

export const addChainToken = async (addtoken) => {
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await window.ethereum.request({
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
    if (wasAdded) {
      localStorage.setItem(storageConstants.KEY_TOKEN_NEED_ADD, "");
    } else {
      localStorage.setItem(storageConstants.KEY_TOKEN_NEED_ADD, "");
    }
  } catch (error) {
    console.log(error);
    localStorage.setItem(storageConstants.KEY_TOKEN_NEED_ADD, "");
  }
};

export const getTokenSymbol = (
  symbol: string | undefined,
  chId: number | string | undefined
) => {
  let tokenSymbol = symbol;
  const chainId = Number(chId);
  switch (chainId) {
    case 250:
      if (symbol === "wETH") {
        tokenSymbol = "WETH";
      }
      if (symbol === "wBTC") {
        tokenSymbol = "WBTC";
      }
      if (symbol === "wFTM") {
        tokenSymbol = "WFTM";
      }
      break;

    default:
      break;
  }
  return tokenSymbol;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getTokenListSymbol = (symbol, chId) => {
  const name = symbol;
  // const chainId = Number(chId);
  // if (chainId === 43114) {
  //   // 43114
  //   if (symbol === "USDT") {
  //     name = "USDT.e";
  //   }
  //   if (symbol === "DAI") {
  //     name = "DAI.e";
  //   }
  //   if (symbol === "USDC") {
  //     name = "USDC.e";
  //   }
  //   if (symbol === "WETH") {
  //     name = "WETH.e";
  //   }
  //   if (symbol === "IMX") {
  //     name = "IMX.a";
  //   }
  // }
  // if (chainId === 250) {
  //   if (symbol === "USDT") {
  //     name = "fUSDT";
  //   }
  // }
  // if (chainId === 56) {
  //   if (symbol === "WBNB") {
  //     name = "BNB";
  //   }
  // }

  // if (chainId === 42220) {
  //   if (symbol === "USDC") {
  //     name = "openUSDC";
  //   }
  //   if (symbol === "USDT") {
  //     name = "openUSDT";
  //   }
  //   if (symbol === "WETH") {
  //     name = "openWETH";
  //   }
  // }

  // if (chainId === 137) {
  //   if (symbol === "WMATIC") {
  //     name = "MATIC";
  //   }
  // }

  // if (chainId === 97) {
  //   if (symbol === "WBNB") {
  //     name = "BNB";
  //   }
  // }

  // if (chainId === 43113) {
  //   if (symbol === "WAVAX") {
  //     name = "AVAX";
  //   }
  // }
  return name;
};

export interface BigAmountDelayInfo {
  rpcUrl: string;
  contractAddress: string;
  tokenAddress: string;
  period: string;
  thresholds: string;
}
