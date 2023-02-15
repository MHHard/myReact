/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getNetworkById } from "../constants/network";
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
import { EstimateAmtResponse, GetRfqConfigsResponse } from "../proto/gateway/gateway_pb";
import { storageConstants } from "../constants/const";
import { PriceResponse } from "../proto/sdk/service/rfq/user_pb";
import { twoChainBridged } from "../hooks/transferSupportedInfoList";
import { isAptosChain } from "../providers/NonEVMContextProvider";

/* eslint-disable camelcase */
/* eslint-disable no-debugger */
interface TransferIState {
  transferConfig: GetTransferConfigsResponse;
  rfqConfig: GetRfqConfigsResponse.AsObject;
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
}

const initialState: TransferIState = {
  transferConfig: {
    chains: [],
    chain_token: {},
    pegged_pair_configs: [],
  },
  rfqConfig: {
    chaintokensList: [],
    rfqContractAddressesMap: [],
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
};

const transferSlice = createSlice({
  name: "lp",
  initialState,
  reducers: {
    setTransferConfig: (state, { payload }: PayloadAction<GetTransferConfigsResponse>) => {
      const configsWithETH = payload;

      const chainIds = [
        1, // Ethereum
        42161, // Arbitrum
        10, // Optimism
        5, // Goerli
        288, // BOBA,
        42170, // Arbitrum Nova
      ];

      chainIds.forEach(chainId => {
        const chainToken = payload.chain_token[chainId];

        if (!chainToken) {
          return;
        }
        const currentChainTokens = chainToken.token;
        const wethTokens = currentChainTokens.filter(token => {
          return token.token.symbol === "WETH";
        });

        if (wethTokens.length > 0) {
          const wethToken = wethTokens[0];
          wethToken.icon = "https://get.celer.app/cbridge-icons/WETH.png";
          const wethTokenInfo = wethToken.token;
          currentChainTokens.push({
            token: {
              symbol: "WETH",
              address: wethTokenInfo.address,
              decimal: wethTokenInfo.decimal,
              xfer_disabled: wethTokenInfo.xfer_disabled,
              display_symbol: "ETH",
            },
            name: "ETH",
            icon: "https://get.celer.app/cbridge-icons/ETH.png",
            max_amt: wethToken.max_amt,
            transfer_disabled: wethToken.transfer_disabled,
            liq_add_disabled: wethToken.liq_add_disabled,
            liq_rm_disabled: wethToken.liq_rm_disabled,
            liq_agg_rm_src_disabled: wethToken.liq_agg_rm_src_disabled,
          });
        }
        configsWithETH[chainId] = currentChainTokens;
      });

      const configsLength = payload.pegged_pair_configs.length;
      const multiBurnConfigs: MultiBurnPairConfig[] = [];

      for (let i = 0; i < configsLength; i++) {
        for (let j = i + 1; j < configsLength; j++) {
          const peggedConfigI = payload.pegged_pair_configs[i];
          const peggedConfigJ = payload.pegged_pair_configs[j];
          if (
            peggedConfigI.org_chain_id === peggedConfigJ.org_chain_id &&
            peggedConfigI.org_token.token.symbol === peggedConfigJ.org_token.token.symbol
          ) {
            /// Only upgraded PegBridge can support multi burn to other pegged chain
            /// Meanwhile, burn mint mode are disabled for Aptos chain
            const peggedConfigIPegChainIsAptosChain = isAptosChain(peggedConfigI.pegged_chain_id);
            const peggedConfigJPegChainIsAptosChain = isAptosChain(peggedConfigJ.pegged_chain_id);
            if (
              peggedConfigI.bridge_version === 2 &&
              peggedConfigJ.bridge_version === 2 &&
              !peggedConfigIPegChainIsAptosChain &&
              !peggedConfigJPegChainIsAptosChain
            ) {
              multiBurnConfigs.push({
                burn_config_as_org: {
                  chain_id: peggedConfigI.pegged_chain_id,
                  token: peggedConfigI.pegged_token,
                  burn_contract_addr: peggedConfigI.pegged_burn_contract_addr,
                  canonical_token_contract_addr: peggedConfigI.canonical_token_contract_addr,
                  burn_contract_version: peggedConfigI.bridge_version,
                },
                burn_config_as_dst: {
                  chain_id: peggedConfigJ.pegged_chain_id,
                  token: peggedConfigJ.pegged_token,
                  burn_contract_addr: peggedConfigJ.pegged_burn_contract_addr,
                  canonical_token_contract_addr: peggedConfigJ.canonical_token_contract_addr,
                  burn_contract_version: peggedConfigJ.bridge_version,
                },
              });
              multiBurnConfigs.push({
                burn_config_as_org: {
                  chain_id: peggedConfigJ.pegged_chain_id,
                  token: peggedConfigJ.pegged_token,
                  burn_contract_addr: peggedConfigJ.pegged_burn_contract_addr,
                  canonical_token_contract_addr: peggedConfigJ.canonical_token_contract_addr,
                  burn_contract_version: peggedConfigJ.bridge_version,
                },
                burn_config_as_dst: {
                  chain_id: peggedConfigI.pegged_chain_id,
                  token: peggedConfigI.pegged_token,
                  burn_contract_addr: peggedConfigI.pegged_burn_contract_addr,
                  canonical_token_contract_addr: peggedConfigI.canonical_token_contract_addr,
                  burn_contract_version: peggedConfigI.bridge_version,
                },
              });
            }
          }
        }
      }

      const ethPeggedPairConfigs: PeggedPairConfig[] = [];

      payload.pegged_pair_configs.forEach(peggedPairConfig => {
        if (
          chainIds.includes(peggedPairConfig.org_chain_id) &&
          peggedPairConfig.org_token.token.symbol === "WETH" &&
          peggedPairConfig.vault_version > 0
        ) {
          const wethToken = peggedPairConfig.org_token;
          const wethTokenInfo = wethToken.token;
          const ethToken: TokenInfo = {
            token: {
              symbol: "WETH",
              address: wethTokenInfo.address,
              decimal: wethTokenInfo.decimal,
              xfer_disabled: wethTokenInfo.xfer_disabled,
              display_symbol: "ETH",
            },
            name: "ETH",
            icon: "https://get.celer.app/cbridge-icons/ETH.png",
            max_amt: wethToken.max_amt,
          };

          ethPeggedPairConfigs.push({
            org_chain_id: peggedPairConfig.org_chain_id,
            org_token: ethToken,
            pegged_chain_id: peggedPairConfig.pegged_chain_id,
            pegged_token: peggedPairConfig.pegged_token,
            pegged_burn_contract_addr: peggedPairConfig.pegged_burn_contract_addr,
            pegged_deposit_contract_addr: peggedPairConfig.pegged_deposit_contract_addr,
            canonical_token_contract_addr: peggedPairConfig.canonical_token_contract_addr,
            bridge_version: peggedPairConfig.bridge_version,
            vault_version: peggedPairConfig.vault_version,
            migration_peg_burn_contract_addr: peggedPairConfig.migration_peg_burn_contract_addr,
          });
        }
      });

      payload.pegged_pair_configs = payload.pegged_pair_configs
        .concat(ethPeggedPairConfigs)
        .filter(peggedPairConfig => {
          return !(
            peggedPairConfig.org_chain_id === 5 &&
            peggedPairConfig.pegged_chain_id === 647 &&
            peggedPairConfig.org_token.name === "Wrapped Ether"
          );
        });

      const chainToken = payload.chain_token;

      const bridgedIds = new Set<number>();
      const allChainIds = payload.chains.map(chainInfo => {
        return chainInfo.id;
      });

      allChainIds.forEach(id1 => {
        if (bridgedIds.has(id1)) {
          return;
        }
        allChainIds.forEach(id2 => {
          if (id1 === id2) {
            return;
          }

          if (twoChainBridged(id1, id2, payload, multiBurnConfigs)) {
            bridgedIds.add(id1);
            bridgedIds.add(id2);
          }
        });
      });

      state.supportTransferChains = Array.from(bridgedIds);

      if (process.env.REACT_APP_ENV_TYPE === "staging") {
        const allValues = Object.values(chainToken);
        allValues.forEach(tokenInfo => {
          tokenInfo.token.forEach(tokenItem => {
            tokenItem.transfer_disabled = false;
            tokenItem.liq_add_disabled = false;
            tokenItem.liq_rm_disabled = false;
            tokenItem.liq_agg_rm_src_disabled = false;
          });
        });
      }

      state.transferConfig = payload;
      state.multiBurnConfigs = multiBurnConfigs;
    },
    setRfqConfig: (state, { payload }: PayloadAction<GetRfqConfigsResponse.AsObject>) => {
      state.rfqConfig = payload;
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
      localStorage.setItem(storageConstants.KEY_FROM_CHAIN_ID, JSON.stringify(payload.id));
      state.fromChain = payload;
    },
    setToChain: (state, { payload }: PayloadAction<Chain>) => {
      localStorage.setItem(storageConstants.KEY_TO_CHAIN_ID, JSON.stringify(payload.id));
      state.toChain = payload;
    },
    setSelectedToken: (state, { payload }: PayloadAction<TokenInfo>) => {
      state.selectedToken = payload;
      localStorage.setItem(
        storageConstants.KEY_SELECTED_TOKEN_SYMBOL,
        payload.token.display_symbol ?? payload.token.symbol,
      );
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
  },
});

export const {
  setTransferConfig,
  setRfqConfig,
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
} = transferSlice.actions;

export default transferSlice.reducer;

interface SwitchChainSuccessCallback {
  (id: number): void;
}

export const switchChain = async (id, atoken, switchChainSuccessCallback: SwitchChainSuccessCallback) => {
  const inId = Number(id);

  const providerName = localStorage.getItem(storageConstants.KEY_WEB3_PROVIDER_NAME);
  if (providerName && providerName === "walletconnect") {
    return;
  }

  try {
    if (window.clover) {
      const walletRpcUrl = getNetworkById(inId).walletRpcUrl ?? getNetworkById(inId).rpcUrl
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
        const walletRpcUrl = getNetworkById(inId).walletRpcUrl ?? getNetworkById(inId).rpcUrl
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${inId.toString(16)}`,
              rpcUrls: [ walletRpcUrl ],
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
