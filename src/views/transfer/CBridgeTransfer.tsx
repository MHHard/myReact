/* eslint-disable no-shadow */
/* eslint-disable camelcase */
import { useCallback, useEffect, useState } from "react";
import { MapLike } from "typescript";
import { StaticJsonRpcProvider } from "@ethersproject/providers"; // InfuraProvider,
import TransferContent from "../transfer/TransferContent";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { closeModal, ModalName } from "../../redux/modalSlice";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import {
  setCBridgeAddresses,
  setCBridgeDesAddresses,
  setFarmingRewardAddresses,
  setRfqContractAddr,
  setTransferAgentAddress,
} from "../../redux/globalInfoSlice";
import {
  setIsChainShow,
  setTokenList,
  setFromChain,
  setToChain,
  setSelectedToken,
  switchChain,
  addChainToken,
  setRefreshTransferAndLiquidity,
  setDisableTransferAddlqAggregatelqAction,
  setDisableTransferAddlqAggregatelqActionLoading,
  setCircleUSDCConfig,
  setGetConfigsFinish,
  setPriceOfTokens,
  setRfqConfig,
  setTransferConfig,
  setSupportTransferChains,
  setMultiBurnConfigs,
} from "../../redux/transferSlice";
import {
  Chain,
  ChainTokenInfo,
  TokenInfo as LocalTokenInfo,
  PeggedPairConfig as LocalPeggedPairConfig,
  LocalChainConfigType,
  MultiBurnPairConfig,
  TokenInfo,
} from "../../constants/type";
import History from "../history/History";
import {
  twoChainBridged,
  useTransferSupportedChainList,
  useTransferSupportedTokenList,
} from "../../hooks/transferSupportedInfoList";
import { storageConstants } from "../../constants/const";
import ProviderModal from "../../components/ProviderModal";
import ChainList from "../../components/transfer/ChainList";
import UserIsBlockedModal from "../../components/UserIsBlockedModal";
import { ethSupportedChainIds, unambiguousTokenSymbol } from "../../helpers/tokenInfo";

import {
  pingUserAddress,
  getTransferConfigs,
  getRfqConfig,
  getPriceOfTokens,
  getCircleUSDCConfigs,
} from "../../redux/gateway";
import { GetRfqConfigsRequest, GetTransferConfigsRequest, PeggedPairConfig } from "../../proto/gateway/gateway_pb";
import { convertProtoStructToLocalTokenInfoList, convertProtoStructToLocalTokenInfoType } from "../TransferHome";
import Header from "../../components/header/Header";
import { DisabledModal } from "../../components/common/DisabledModal";
import { NetworkInfo } from "../../constants/network";
// import { useWindowWidth } from "../../hooks";
import "../../app.less";

interface IProps {
  showHistory: boolean;
  provider: StaticJsonRpcProvider | undefined;
  configuration: LocalChainConfigType;
}
const CBridgeTransfer = (data: IProps) => {
  const { chainId, address, getNetworkById, setWbe3Config } = useWeb3Context();
  const { configuration, showHistory, provider } = data;
  // useWindowWidth();
  console.log("9999999999110", data);
  const { modal, transferInfo } = useAppSelector(state => state);
  const { showProviderModal, showHistoryModal, showUserIsBlockedModal, showDisabledModal } = modal;

  const {
    transferConfig,
    isChainShow,
    chainSource,
    fromChain,
    toChain,
    refreshTransferAndLiquidity,
    supportTransferChains,
    rfqConfig,
  } = transferInfo;
  const { chains, chain_token } = transferConfig;
  const transferSupportedChainList = useTransferSupportedChainList(true);
  const { supportTokenList } = useTransferSupportedTokenList();
  const dispatch = useAppDispatch();
  const [chainList, setChainList] = useState<Chain[]>([]);

  useEffect(() => {
    setWbe3Config(provider, configuration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseProviderModal = () => {
    dispatch(closeModal(ModalName.provider));
  };
  const handleCloseHistoryModal = () => {
    dispatch(setRefreshTransferAndLiquidity(!refreshTransferAndLiquidity));
    dispatch(closeModal(ModalName.history));
  };

  const handleCloseDisabledModal = () => {
    dispatch(closeModal(ModalName.disabledModal));
  };

  useEffect(() => {
    const req = new GetTransferConfigsRequest();
    Promise.all([
      getTransferConfigs(req),
      getRfqConfig(new GetRfqConfigsRequest()),
      getPriceOfTokens(),
      getCircleUSDCConfigs(),
    ]).then(values => {
      const res = values[0];
      const rfqRes = values[1]?.toObject();
      const circleUSDCConfigsResponse = values[3]?.toObject();
      console.debug("999999res: ", circleUSDCConfigsResponse);

      if (circleUSDCConfigsResponse && !circleUSDCConfigsResponse.err) {
        dispatch(setCircleUSDCConfig(circleUSDCConfigsResponse));
      }

      if (rfqRes && !rfqRes.err) {
        dispatch(
          setRfqConfig({
            chaintokensList: rfqRes.chaintokensList,
            rfqContractAddressesMap: rfqRes.rfqContractAddressesMap,
          }),
        );
      }
      if (res) {
        // const { chains, chain_token, farming_reward_contract_addr, pegged_pair_configs } = res;
        const { chainsList, chainTokenMap, peggedPairConfigsList, blockedBridgeDirectList } = res.toObject();
        const newtokenMap: MapLike<ChainTokenInfo> = {};
        chainTokenMap?.map(item => {
          if (item?.length === 2) {
            newtokenMap[item[0]] = {
              token: convertProtoStructToLocalTokenInfoList(item[1].tokenList, item[0]),
            };
          }
          return item;
        });
        const newChainsList = chainsList?.map(item => {
          const chain: Chain = {
            id: item?.id,
            name: item?.name,
            icon: item?.icon,
            block_delay: item?.blockDelay,
            gas_token_symbol: item?.gasTokenSymbol,
            explore_url: item?.exploreUrl,
            rpc_url: "",
            contract_addr: item?.contractAddr,
            drop_gas_amt: item?.dropGasAmt,
            farming_reward_contract_addr: item?.farmingRewardContractAddr,
            transfer_agent_contract_addr: item?.transferAgentContractAddr,
          };
          return chain;
        });
        const newPeggedPairConfigsList = peggedPairConfigsList?.map((item: PeggedPairConfig.AsObject) => {
          const newItem: LocalPeggedPairConfig = {
            org_chain_id: item?.orgChainId,
            org_token: convertProtoStructToLocalTokenInfoType(item?.orgToken, item?.orgChainId),
            pegged_chain_id: item?.peggedChainId,
            pegged_token: convertProtoStructToLocalTokenInfoType(item?.peggedToken, item?.peggedChainId),
            pegged_deposit_contract_addr: item?.peggedDepositContractAddr,
            pegged_burn_contract_addr: item?.peggedBurnContractAddr,
            canonical_token_contract_addr: item?.canonicalTokenContractAddr,
            vault_version: item?.vaultVersion,
            bridge_version: item?.bridgeVersion,
            migration_peg_burn_contract_addr: item?.migrationPegBurnContractAddr,
          };

          return newItem;
        });
        const chains = newChainsList;
        const chain_token = newtokenMap;
        const localChains: NetworkInfo[] = Object.values(configuration) as NetworkInfo[];
        const filteredChains = chains?.filter(item => {
          const filterLocalChains = localChains?.filter(localChainItem => localChainItem.chainId === item.id);
          return filterLocalChains.length > 0;
        });
        const configRes = {
          chains: filteredChains,
          chain_token,
          pegged_pair_configs: newPeggedPairConfigsList,
          blocked_bridge_direct_list: blockedBridgeDirectList,
        };
        const configsWithETH = configRes;
        ethSupportedChainIds?.forEach(chainId => {
          const chainToken = configRes.chain_token[chainId];

          if (!chainToken) {
            return;
          }
          const currentChainTokens = chainToken.token;
          const wethTokens = currentChainTokens?.filter(token => {
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
                chainId,
                isNative: true,
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

        const configsLength = configRes.pegged_pair_configs.length;
        const multiBurnConfigs: MultiBurnPairConfig[] = [];

        for (let i = 0; i < configsLength; i++) {
          for (let j = i + 1; j < configsLength; j++) {
            const peggedConfigI = configRes.pegged_pair_configs[i];
            const peggedConfigJ = configRes.pegged_pair_configs[j];
            if (
              peggedConfigI.org_chain_id === peggedConfigJ.org_chain_id &&
              peggedConfigI.org_token.token.symbol === peggedConfigJ.org_token.token.symbol
            ) {
              /// Only upgraded PegBridge can support multi burn to other pegged chain
              /// Meanwhile, burn mint mode are disabled for Aptos chain
              if (peggedConfigI.bridge_version === 2 && peggedConfigJ.bridge_version === 2) {
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

        const ethPeggedPairConfigs: LocalPeggedPairConfig[] = [];

        configRes.pegged_pair_configs?.forEach(peggedPairConfig => {
          if (
            ethSupportedChainIds.includes(peggedPairConfig.org_chain_id) &&
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
                chainId: peggedPairConfig.org_chain_id,
                isNative: true,
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

        configRes.pegged_pair_configs = configRes.pegged_pair_configs
          .concat(ethPeggedPairConfigs)
          .filter(peggedPairConfig => {
            return !(
              peggedPairConfig.org_chain_id === 5 &&
              peggedPairConfig.pegged_chain_id === 647 &&
              peggedPairConfig.org_token.name === "Wrapped Ether"
            );
          });

        const chainToken = configRes.chain_token;

        const bridgedIds = new Set<number>();
        const allChainIds = configRes.chains.map(chainInfo => {
          return chainInfo.id;
        });
        allChainIds?.forEach(id1 => {
          if (bridgedIds.has(id1)) {
            return;
          }
          allChainIds?.forEach(id2 => {
            if (id1 === id2) {
              return;
            }

            if (twoChainBridged(id1, id2, configRes, multiBurnConfigs, [], getNetworkById)) {
              bridgedIds.add(id1);
              bridgedIds.add(id2);
            }
          });
        });
        dispatch(setSupportTransferChains(Array.from(bridgedIds)));
        if (process.env.REACT_APP_ENV_TYPE === "staging") {
          const allValues = Object.values(chainToken);
          allValues?.forEach(tokenInfo => {
            tokenInfo?.token?.forEach(tokenItem => {
              tokenItem.transfer_disabled = false;
              tokenItem.liq_add_disabled = false;
              tokenItem.liq_rm_disabled = false;
              tokenItem.liq_agg_rm_src_disabled = false;
            });
          });
        }
        dispatch(setTransferConfig(configRes));
        dispatch(setMultiBurnConfigs(multiBurnConfigs));
        const tokenPriceConfig = values[2];
        dispatch(setPriceOfTokens(tokenPriceConfig));
        // dispatch(setFarmingRewardAddresses(farming_reward_contract_addr));
        dispatch(setGetConfigsFinish(true));
        // 设置默认信息

        const displayChains = filteredChains.filter(item => {
          const enableTokens = chain_token[item.id].token.filter(tokenItem => !tokenItem.token.xfer_disabled);
          const hasPegToken =
            newPeggedPairConfigsList.filter(pgItem => {
              return item.id === pgItem.org_chain_id || item.id === pgItem.pegged_chain_id;
            }).length > 0;
          return (enableTokens.length > 0 || hasPegToken) && item.id !== 1666600000;
        });
        setChainList(displayChains);
      } else {
        // message.error("Interface error !");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isProdEnv = process.env.REACT_APP_ENV === "MAINNET" && process.env.NODE_ENV === "production";

    if (!isProdEnv) {
      dispatch(setDisableTransferAddlqAggregatelqAction(false));
    } else {
      dispatch(setDisableTransferAddlqAggregatelqActionLoading(true));
      pingUserAddress(address)
        .then(res => {
          console.log(res);
          if (res.err) {
            dispatch(setDisableTransferAddlqAggregatelqAction(true));
          } else if (res.is_anonymous && !res.is_white_list) {
            dispatch(setDisableTransferAddlqAggregatelqAction(true));
          } else {
            dispatch(setDisableTransferAddlqAggregatelqAction(false));
          }
          dispatch(setDisableTransferAddlqAggregatelqActionLoading(false));
        })
        .catch(() => {
          dispatch(setDisableTransferAddlqAggregatelqAction(true));
          dispatch(setDisableTransferAddlqAggregatelqActionLoading(false));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    const clearTag = localStorage.getItem(storageConstants.KEY_CLEAR_TAG);
    if (clearTag !== "clearForTransferHistoryIteration2") {
      localStorage.clear();
    }
    localStorage.setItem(storageConstants.KEY_CLEAR_TAG, "clearForTransferHistoryIteration2");
    const localeToAddTokenStr = localStorage.getItem(storageConstants.KEY_TO_ADD_TOKEN);
    if (localeToAddTokenStr && provider) {
      const localeToAddToken = JSON.parse(localeToAddTokenStr).atoken;
      addChainToken(localeToAddToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  useEffect(() => {
    if (toChain && toChain !== undefined && transferSupportedChainList.length > 0) {
      // if (transferSupportedChainList.)
      const toChainNotSuitableForSourceChain =
        transferSupportedChainList.filter(chainInfo => {
          return chainInfo.id === toChain.id;
        }).length === 0;

      if (toChainNotSuitableForSourceChain) {
        setToChainMethod(transferSupportedChainList[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transferSupportedChainList]);

  useEffect(() => {
    const cacheTokenSymbol = localStorage.getItem(storageConstants.KEY_SELECTED_TOKEN_SYMBOL);

    if (fromChain && fromChain !== undefined && toChain && toChain !== undefined) {
      if (supportTokenList.length > 0) {
        let potentialTokenList = supportTokenList.filter(tokenInfo => {
          return tokenInfo.token.symbol === cacheTokenSymbol;
        });

        /// Circle USDC has higher priority than USDC.e on Avalanche and Arbitrum One
        if (cacheTokenSymbol === "USDC") {
          const listWithCircleUSDC = supportTokenList.filter(tokenInfo => {
            return tokenInfo.token.symbol === "USDC_CIRCLE";
          });

          if (listWithCircleUSDC.length > 0) {
            potentialTokenList = listWithCircleUSDC;
          }
        }

        if (potentialTokenList.length === 0) {
          if (cacheTokenSymbol === "ETH") {
            const specialWETHToken = supportTokenList.find(tokenInfo => {
              return tokenInfo.token.symbol === "WETH";
            });
            if (specialWETHToken) {
              dispatch(setSelectedToken(specialWETHToken));
              return;
            }
          }

          let specifiedDefaultToken = supportTokenList.find(_ => _.token.symbol === "USDC");
          if (!specifiedDefaultToken) {
            specifiedDefaultToken = supportTokenList[0];
          }
          dispatch(setSelectedToken(specifiedDefaultToken));
        } else {
          dispatch(setSelectedToken(potentialTokenList[0]));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportTokenList]);

  useEffect(() => {
    if (toChain && toChain !== undefined && transferSupportedChainList.length > 0) {
      // if (transferSupportedChainList.)
      const toChainNotSuitableForSourceChain =
        transferSupportedChainList.filter(chainInfo => {
          return chainInfo.id === toChain.id;
        }).length === 0;

      if (toChainNotSuitableForSourceChain) {
        setToChainMethod(transferSupportedChainList[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transferSupportedChainList]);

  useEffect(() => {
    const cacheTokenSymbol = localStorage.getItem(storageConstants.KEY_SELECTED_TOKEN_SYMBOL);

    if (fromChain && fromChain !== undefined && toChain && toChain !== undefined) {
      if (supportTokenList.length > 0) {
        let potentialTokenList = supportTokenList.filter(tokenInfo => {
          return tokenInfo.token.symbol === cacheTokenSymbol;
        });

        /// Circle USDC has higher priority than USDC.e on Avalanche and Arbitrum One
        if (cacheTokenSymbol === "USDC") {
          const listWithCircleUSDC = supportTokenList.filter(tokenInfo => {
            return tokenInfo.token.symbol === "USDC_CIRCLE";
          });

          if (listWithCircleUSDC.length > 0) {
            potentialTokenList = listWithCircleUSDC;
          }
        }

        if (potentialTokenList.length === 0) {
          if (cacheTokenSymbol === "ETH") {
            const specialWETHToken = supportTokenList.find(tokenInfo => {
              return tokenInfo.token.symbol === "WETH";
            });
            if (specialWETHToken) {
              dispatch(setSelectedToken(specialWETHToken));
              return;
            }
          }

          let specifiedDefaultToken = supportTokenList.find(_ => _.token.symbol === "USDC");
          if (!specifiedDefaultToken) {
            specifiedDefaultToken = supportTokenList[0];
          }
          dispatch(setSelectedToken(specifiedDefaultToken));
        } else {
          dispatch(setSelectedToken(potentialTokenList[0]));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportTokenList]);

  useEffect(() => {
    if (chainId) {
      const chainName = getNetworkById(chainId)?.name;
      if (chainName) {
        localStorage.setItem(storageConstants.KEY_CHAIN_NAME, chainName);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  useEffect(() => {
    if (chainId && transferConfig) {
      const chainConfig = transferConfig.chains.find(it => it.id === chainId);
      if (chainConfig) {
        dispatch(setFarmingRewardAddresses(chainConfig.farming_reward_contract_addr));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, transferConfig]);

  useEffect(() => {
    if (chainId && rfqConfig) {
      const rfqContractAddresses = rfqConfig.rfqContractAddressesMap.find(it => it[0] === chainId);
      if (rfqContractAddresses) {
        dispatch(setRfqContractAddr(rfqContractAddresses[1]));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, rfqConfig]);

  const getChainInfoById = (chainList, sourceChainId, destinationChainId) => {
    let sourceChain;
    let destinChain;
    const defaultFromChains = chainList.filter(
      item => Number(item.id) === Number(sourceChainId) && Number(item.id) !== 1666600000,
    );
    if (defaultFromChains.length > 0) {
      sourceChain = defaultFromChains[0];
    }
    const defaultToChains = chainList.filter(
      item => Number(item.id) === Number(destinationChainId) && Number(item.id) !== 1666600000,
    );
    if (defaultToChains.length > 0) {
      destinChain = defaultToChains[0];
    }
    return { sourceChain, destinChain };
  };

  const setDefaultInfo = useCallback(
    (chains, chain_token, chainId) => {
      console.log(22221111, chains);
      if (chains.length > 1) {
        let cacheFromChainId = localStorage.getItem(storageConstants.KEY_FROM_CHAIN_ID);

        if (chainId > 0 && localStorage.getItem(storageConstants.KEY_CHAIN_ID_HIGH_PRIORITY) === "1") {
          cacheFromChainId = chainId;
          localStorage.setItem(storageConstants.KEY_CHAIN_ID_HIGH_PRIORITY, "0");
        }

        const cacheToChainId = localStorage.getItem(storageConstants.KEY_TO_CHAIN_ID);

        const dataInfo = getChainInfoById(chains, cacheFromChainId, cacheToChainId); // get info by id
        const { sourceChain, destinChain } = dataInfo;

        const cacheFromChain = sourceChain;
        const cacheToChain = destinChain;
        let defaultFromChain;
        let defaultToChain;

        if (chainId) {
          const chainInfo = chains.filter(item => Number(item.id) === chainId && Number(item.id) !== 1666600000);
          if (cacheFromChain && cacheFromChain !== "undefined") {
            const localFromChain = cacheFromChain;
            const newLocalFromCahinInfo = chains.filter(
              item => Number(item.id) === localFromChain.id && Number(item.id) !== 1666600000,
            );
            if (newLocalFromCahinInfo.length > 0) {
              defaultFromChain = localFromChain;
            } else {
              defaultFromChain = chains[0];
            }
          } else if (chainInfo.length > 0) {
            defaultFromChain = chainInfo[0];
          } else {
            defaultFromChain = chains[0];
          }

          // Find to chain
          defaultToChain = chains[1];
          if (cacheToChain && cacheToChain !== "undefined") {
            defaultToChain = cacheToChain;
          }
        } else {
          // Display from chain and source chain without wallet connection
          if (cacheFromChain) {
            defaultFromChain = cacheFromChain;
          } else {
            defaultFromChain = chains[0];
          }
          if (cacheToChain) {
            defaultToChain = cacheToChain;
          } else {
            const nonDefaultFromChains = chains.filter(chainInfo => {
              return chainInfo.id !== defaultFromChain.id;
            });
            if (nonDefaultFromChains.length > 0) {
              defaultToChain = nonDefaultFromChains.find(_ => _.id === 56);
              if (!defaultToChain) {
                defaultToChain = chains[1];
              }
            } else {
              defaultToChain = chains[1];
            }
          }
        }
        console.log("defaultFromChain999", defaultFromChain);
        if (
          defaultFromChain &&
          supportTransferChains.length > 0 &&
          !supportTransferChains.includes(defaultFromChain.id)
        ) {
          const tempChainId = supportTransferChains[0];
          const tempChains = chains.filter(item => Number(item.id) === tempChainId && Number(item.id) !== 1666600000);
          if (tempChains && tempChains.length > 0) {
            defaultFromChain = tempChains[0];
          }
        }
        if (defaultToChain && supportTransferChains.length > 0 && !supportTransferChains.includes(defaultToChain.id)) {
          const tempChainId = supportTransferChains[1];
          const tempChains = chains.filter(item => Number(item.id) === tempChainId && Number(item.id) !== 1666600000);
          if (tempChains && tempChains.length > 0) {
            defaultToChain = tempChains[0];
          }
        }

        if (defaultFromChain) {
          const defalutTokenList = chain_token[defaultFromChain.id]?.token;
          dispatch(setFromChain(defaultFromChain));
          dispatch(setToChain(defaultToChain));
          dispatch(setCBridgeDesAddresses(defaultToChain?.contract_addr));
          dispatch(setCBridgeAddresses(defaultFromChain?.contract_addr));
          dispatch(setTransferAgentAddress(defaultFromChain?.transfer_agent_contract_addr));
          dispatch(setTokenList(defalutTokenList));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, chainId, chains, supportTransferChains],
  );

  // Update cBridge contract address if needed
  useEffect(() => {
    if (!fromChain) {
      return;
    }
    dispatch(setCBridgeAddresses(fromChain.contract_addr));
    dispatch(setTransferAgentAddress(fromChain.transfer_agent_contract_addr ?? ""));
  }, [dispatch, chainId, fromChain]);

  const handleSelectChain = (id: number) => {
    if (chainSource === "from") {
      if (id !== chainId) {
        switchMethod(id, "");
      } else if (id !== fromChain?.id) {
        /// Scenario:
        /// Flow as source chain
        /// MetaMask connect evm chain A
        /// User wants to use evm chain A as source chain
        const chain = transferConfig.chains.find(chainInfo => {
          return chainInfo.id === id;
        });
        if (chain !== undefined) {
          dispatch(setFromChain(chain));
        }
      }
    } else if (chainSource === "to") {
      setToChainMethod(id);
    } else if (chainSource === "wallet") {
      if (id !== chainId) {
        switchMethod(id, "");
      } else if (id !== fromChain?.id) {
        /// Scenario:
        /// Flow as source chain
        /// MetaMask connect evm chain A
        /// User wants to use evm chain A as source chain
        const chain = transferConfig.chains.find(chainInfo => {
          return chainInfo.id === id;
        });
        if (chain !== undefined) {
          dispatch(setFromChain(chain));
        }
      }
    }
    dispatch(setIsChainShow(false));
  };

  const switchMethod = (paramChainId, paramToken) => {
    switchChain(
      paramChainId,
      paramToken,
      (targetFromChainId: number) => {
        const chain = transferConfig.chains.find(chainInfo => {
          return chainInfo.id === targetFromChainId;
        });
        if (chain !== undefined) {
          dispatch(setFromChain(chain));
        }
      },
      getNetworkById,
    );

    const newTokenList: LocalTokenInfo[] = chain_token[chainId]?.token;
    dispatch(setTokenList(newTokenList));
    if (newTokenList) {
      const cacheTokensymbol = localStorage.getItem(storageConstants.KEY_SELECTED_TOKEN_SYMBOL);
      const cacheTokenList = newTokenList.filter(item => cacheTokensymbol === unambiguousTokenSymbol(item.token));
      if (cacheTokenList.length > 0) {
        dispatch(setSelectedToken(cacheTokenList[0]));
      } else {
        dispatch(setSelectedToken(newTokenList[0]));
      }
    }
  };

  const setToChainMethod = (id?: number) => {
    if (!chains || !chain_token || !chains.length) {
      return;
    }
    const targetToChain: Chain =
      chains.find(chain => chain.id === id) || chains.find(chain => chain.id !== fromChain?.id) || chains[0];
    if (targetToChain) {
      dispatch(setToChain(targetToChain));
      dispatch(setCBridgeDesAddresses(targetToChain?.contract_addr));
    }
  };

  useEffect(() => {
    if (chainList?.length === 0 || !chain_token || supportTransferChains.length === 0) {
      return;
    }
    setDefaultInfo(chainList, chain_token, chainId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportTransferChains, chainList, chain_token, chainId]);

  return (
    <div>
      <h2>hhhhhhhhhh</h2>
      <Header showHistory={showHistory} />
      <TransferContent />
      {isChainShow && (
        <ChainList
          visible={isChainShow}
          onSelectChain={handleSelectChain}
          onCancel={() => dispatch(setIsChainShow(false))}
        />
      )}
      {showHistoryModal && <History visible={showHistoryModal} onCancel={handleCloseHistoryModal} />}
      <ProviderModal visible={showProviderModal} onCancel={handleCloseProviderModal} />
      <DisabledModal visible={showDisabledModal} onCancel={handleCloseDisabledModal} />
      {showUserIsBlockedModal && <UserIsBlockedModal />}
    </div>
  );
};

export default CBridgeTransfer;
