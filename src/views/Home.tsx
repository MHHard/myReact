import { useCallback, useEffect, useState } from "react";
import { Layout } from "antd";
import { useHistory } from "react-router-dom";
import { useAsync } from "react-use";
import { debounce } from "lodash";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { closeModal, ModalName } from "../redux/modalSlice";
import ProviderModal from "../components/ProviderModal";
import ChainList from "../pages/ChainList";
import { storageConstants } from "../constants/const";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { setSwapContractAddr } from "../redux/globalInfoSlice";
import {
  setIsChainShow,
  setTransferConfig,
  setFromChain,
  setToChain,
  setSelectedToken,
  switchChain,
  addChainToken,
  setSrcTokenList,
  setDstTokenList,
  setHomeLoading,
  setTransferConfigForBridge,
} from "../redux/transferSlice";

import {
  GetConfigsResponse,
  GetTokenListResponse,
} from "../proto/chainhop/web_pb";
import "./home.less";
import { getNetworkById, type } from "../constants/network";
import { tokenListJson } from "../constants/testTokenList";
import { getSwapConfigs, getTokenList } from "../redux/chainhop";
import { getTransferConfigs } from "../redux/gateway";
import { Chain, Token } from "../proto/chainhop/common_pb";
import { getNativeToken } from "../pages/TokenList";
import { affectedUserAddresses } from "../constants/sgn-ops-data-check/sgn-ops-data-check";
import { COMMONTOKEN_BASES } from "../constants/type";
import BridgeInfo from "../pages/BridgeInfo";
import BridgeContent from "../pages/BridgeContent";

export interface TokenIState {
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
}
function Home(props): JSX.Element {
  const history = useHistory();
  const { chainId, provider, address } = useWeb3Context();
  const { modal, transferInfo } = useAppSelector((state) => state);
  const { showProviderModal } = modal;
  const {
    transferConfig,
    isChainShow,
    chainSource,
    fromChain,
    toChain,
    selectedToken,
    reloadTokenList,
  } = transferInfo;
  const { chains, chainToken } = transferConfig;
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState("");
  const [shouldShowAffectedNotification, setShouldShowAffectedNotification] =
    useState(false);
  const blackListTokens = {
    137: ["0x104592a158490a9228070E0A8e5343B499e125D0"],
    1: ["0xa47c8bf37f92aBed4A126BDA807A7b7498661acD"],
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHistoryPush = useCallback(
    debounce((nextValue) => {
      history.push(
        `/bridge/${nextValue.fromChain?.chainId}/${nextValue.selectedToken?.symbol}/${nextValue.toChain?.chainId}`
      );

      saveSelectedTokenForChain(
        nextValue.toChain?.chainId ?? 0,
        nextValue.selectedToken?.symbol ?? "",
        nextValue.fromChain?.chainId ?? 0
      );
    }, 500),
    []
  );

  const handleCloseProviderModal = () => {
    dispatch(closeModal(ModalName.provider));
  };

  const setLoadingState = (val) => {
    setLoading(val);
    dispatch(setHomeLoading(val));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedAddToken = useCallback(
    debounce((nextValue) => {
      addChainToken(nextValue);
    }, 300),
    []
  );

  useEffect(() => {
    const clearTag = localStorage.getItem(
      storageConstants.KEY_CLEAR_LOCAL_CACHE
    );
    if (clearTag !== storageConstants.KEY_CLEAR_LOCAL_CACHE) {
      // console.log("clear");
      localStorage.clear();
    }
    localStorage.setItem(storageConstants.KEY_CLEAR_LOCAL_CACHE, "clearTag");
    const localeToAddTokenStr = localStorage.getItem(
      storageConstants.KEY_TOKEN_NEED_ADD
    );
    if (localeToAddTokenStr) {
      const localeToAddToken = JSON.parse(localeToAddTokenStr).atoken;
      debouncedAddToken(localeToAddToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const getDefaultData = (chainList, sourceChainId, destinationChainId) => {
    let sourceChain: Chain.AsObject | null = null;
    let destinChain: Chain.AsObject | null = null;

    const defaultFromChains = chainList?.filter(
      (item) =>
        Number(item.chainId) === Number(sourceChainId) &&
        getNetworkById(item?.chainId).name !== "--"
    );
    const defaultToChains = chainList?.filter(
      (item) =>
        Number(item.chainId) === Number(destinationChainId) &&
        getNetworkById(item?.chainId).name !== "--"
    );
    if (defaultFromChains.length > 0) {
      sourceChain = defaultFromChains[0];
    }

    if (defaultToChains.length > 0) {
      destinChain = defaultToChains[0];
    }
    return { sourceChain, destinChain };
  };

  const setDefaultInfo = useCallback((chainList, chainTokenMap, propsIn) => {
    const cacheFromChainId = localStorage.getItem(
      storageConstants.KEY_CHACHE_FROM_CHAIN_ID
    );
    const cacheToChainId = localStorage.getItem(
      storageConstants.KEY_TOCHAIN_ID
    );
    const cacheFromChains = chainList?.filter(
      (item) =>
        Number(item.chainId) === Number(cacheFromChainId) &&
        getNetworkById(item?.chainId).name !== "--"
    );
    const cacheToChains = chainList?.filter(
      (item) =>
        Number(item.chainId) === Number(cacheToChainId) &&
        getNetworkById(item?.chainId).name !== "--"
    );
    const urlData = propsIn.match.params;
    const urlDataSrcChainId = urlData?.srcChainId;
    const urlDataDstChainId = urlData.dstChainId;
    const urlDataInfo = getDefaultData(
      chains,
      urlDataSrcChainId,
      urlDataDstChainId
    );
    const { sourceChain, destinChain } = urlDataInfo;
    let defaultFromChain;
    let defaultToChain;
    defaultFromChain = chains[0];
    if (sourceChain) {
      defaultFromChain = sourceChain;
    } else if (cacheFromChains?.length > 0) {
      defaultFromChain = cacheFromChains[0];
    }
    // toChain
    defaultToChain = chains[1];
    if (destinChain) {
      defaultToChain = destinChain;
    } else if (cacheToChains.length > 0) {
      defaultToChain = cacheToChains[0];
    }
    if (defaultFromChain && defaultToChain) {
      const srcTokenList2 = chainTokenMap[defaultFromChain.chainId]?.tokenList;
      setDefaultSrcToken(
        defaultFromChain,
        srcTokenList2,
        urlData?.srcTokenSymbol
      );
    }
    dispatch(setFromChain(defaultFromChain));
    dispatch(setToChain(defaultToChain));
    setLoadingState(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCommonTokenList = (baseList, cId) => {
    let filterBaseList = [];
    COMMONTOKEN_BASES[cId || 1]?.forEach((token, index) => {
      const tokens =
        baseList?.filter(
          (item) =>
            item?.address?.toLowerCase() === token.address?.toLowerCase() &&
            index !== 0
        ) ?? [];
      if (tokens?.length > 0) {
        filterBaseList = filterBaseList.concat(tokens);
      }
    });
    return filterBaseList?.length > 0 ? filterBaseList : baseList;
  };

  const setDefaultSrcToken = (sourceChain, srcTokenList, urlTokenSymbol) => {
    if (
      sourceChain &&
      srcTokenList &&
      srcTokenList.length > 0 &&
      sourceChain.chainId === srcTokenList[0].chainId
    ) {
      const commonTokenList = getCommonTokenList(
        srcTokenList,
        sourceChain.chainId
      );
      const previousTokenSymbol =
        localStorage.getItem(storageConstants.KEY_SELECTED_TOKEN_SYMBOL) ?? "";
      const sourceNativeToken = getNativeToken(
        sourceChain.chainId,
        srcTokenList
      );
      const previousToken = getDefaultToken(
        previousTokenSymbol,
        sourceNativeToken,
        srcTokenList
      );
      let finalSelectedSourceToken;
      if (urlTokenSymbol) {
        if (
          sourceNativeToken?.symbol?.toLowerCase() ===
          urlTokenSymbol?.toLowerCase()
        ) {
          finalSelectedSourceToken = sourceNativeToken;
        } else {
          const urlToken = srcTokenList.find(
            (tokenInfo) =>
              tokenInfo.symbol.toLowerCase() === urlTokenSymbol?.toLowerCase()
          );
          finalSelectedSourceToken =
            urlToken ??
            previousToken ??
            sourceNativeToken ??
            commonTokenList[0];
        }
      } else {
        finalSelectedSourceToken =
          previousToken ?? sourceNativeToken ?? commonTokenList[0];
      }
      dispatch(setSelectedToken(finalSelectedSourceToken));
      return finalSelectedSourceToken;
    }
    return undefined;
  };

  useEffect(() => {
    if (
      affectedUserAddresses
        .map((_) => _.toLowerCase())
        .includes(address.toLowerCase())
    ) {
      setShouldShowAffectedNotification(true);
    }
  }, [address]);

  const handleSelectChain = (id: number) => {
    if (chainSource === "from") {
      if (id !== fromChain?.chainId) {
        setFromChainMethod(id);
        // if (signer && id !== chainId) {
        //   switchMethod(id, "");
        // }
      }
    } else if (chainSource === "to") {
      setToChainMethod(id);
    } else if (chainSource === "wallet") {
      if (id !== chainId) {
        switchMethod(id, "");
      }
    }
    dispatch(setIsChainShow(false));
  };

  const switchMethod = (paramChainId, paramToken) => {
    switchChain(paramChainId, paramToken);
  };

  const setToChainMethod = (id?: number) => {
    if (!chains || !chainToken || !chains.length) {
      return;
    }
    const targetToChain: Chain.AsObject =
      chains.find((chain) => chain.chainId === id) ||
      chains.find((chain) => chain.chainId !== fromChain?.chainId) ||
      chains[0];
    if (targetToChain) {
      handleToChainChange(targetToChain);
    }
  };
  const setFromChainMethod = (id?: number) => {
    if (!chains || !chainToken || !chains.length || !fromChain) {
      return;
    }
    const targetChain: Chain.AsObject =
      chains.find((chain) => chain.chainId === id) || chains[0];
    if (targetChain) {
      handleFromChainChange(targetChain);
    }
  };

  const handleFromChainChange = (chain, tokenSymbol = "") => {
    dispatch(setFromChain(chain));
    if (type === "test") {
      const tokenLists = JSON.parse(tokenListJson);
      console.log("tokenLists:", tokenLists);
      const list = tokenLists[chain?.chainId ?? 5]?.tokenList;
      setDefaultSrcToken(chain, list, tokenSymbol);
      return;
    }
    if (!chain || !toChain || !chainToken[chain.chainId]) {
      return;
    }
    const tokenList = chainToken[chain.chainId]?.tokenList;
    setDefaultSrcToken(chain, tokenList, tokenSymbol);
  };

  const handleToChainChange = (chain) => {
    dispatch(setToChain(chain));
  };

  useEffect(() => {
    // set swapContractAddr
    if (chainId && chains?.length > 0) {
      const chain = chains?.find((item) => item.chainId === chainId);
      if (chain) {
        handleFromChainChange(chain);
        dispatch(setSwapContractAddr(chain?.executionNode));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, chains]);

  useEffect(() => {
    // set src tokenList
    const customTokenList = getCustomTokenListFromLocalStorage();
    if (type === "test") {
      const tokenLists = JSON.parse(tokenListJson);
      const list = tokenLists[fromChain?.chainId ?? 5]?.tokenList;
      const existingTokenAddresses = list.map((item) => {
        return item.address.toLowerCase();
      });
      const uniqueCustomTokenList =
        customTokenList?.filter((token) => {
          return (
            token.chainId === fromChain?.chainId &&
            !existingTokenAddresses.includes(token.address.toLowerCase())
          );
        }) ?? [];
      dispatch(setSrcTokenList(list.concat(uniqueCustomTokenList)));
      return;
    }
    if (!fromChain || JSON.stringify(chainToken) === "{}") {
      return;
    }
    // eslint-disable-next-line no-shadow
    const srcTokenList = chainToken[fromChain.chainId]?.tokenList;
    const existingTokenAddresses = srcTokenList.map((item) => {
      return item.address.toLowerCase();
    });
    const uniqueCustomTokenList =
      customTokenList?.filter((token) => {
        return (
          token.chainId === fromChain?.chainId &&
          !existingTokenAddresses.includes(token.address.toLowerCase())
        );
      }) ?? [];
    dispatch(setSrcTokenList(srcTokenList.concat(uniqueCustomTokenList)));
  }, [fromChain, chainToken, reloadTokenList, dispatch]);

  useEffect(() => {
    // set dst token list
    const customTokenList = getCustomTokenListFromLocalStorage();

    if (type === "test") {
      const tokenLists = JSON.parse(tokenListJson);
      const list = tokenLists[toChain?.chainId ?? 5]?.tokenList;

      const existingTokenAddresses = list.map((item) => {
        return item.address.toLowerCase();
      });
      const uniqueCustomTokenList =
        customTokenList?.filter((token) => {
          return (
            token.chainId === toChain?.chainId &&
            !existingTokenAddresses.includes(token.address.toLowerCase())
          );
        }) ?? [];
      dispatch(setDstTokenList(list.concat(uniqueCustomTokenList)));
      return;
    }
    if (!toChain || JSON.stringify(chainToken) === "{}") {
      return;
    }
    const dstTokenList = chainToken[toChain.chainId]?.tokenList;
    const existingTokenAddresses = dstTokenList.map((item) => {
      return item.address.toLowerCase();
    });
    const uniqueCustomTokenList =
      customTokenList?.filter((token) => {
        return (
          token.chainId === toChain?.chainId &&
          !existingTokenAddresses.includes(token.address.toLowerCase())
        );
      }) ?? [];
    dispatch(setDstTokenList(dstTokenList.concat(uniqueCustomTokenList)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toChain, chainToken, reloadTokenList]);

  useEffect(() => {
    if (
      fromChain &&
      selectedToken &&
      toChain &&
      history.location.pathname !== "/history"
    ) {
      debouncedHistoryPush({
        fromChain,
        selectedToken,
        toChain,
      });
    }
  }, [fromChain, selectedToken, toChain]);

  useAsync(async () => {
    setLoadingState(true);
    Promise.all([getSwapConfigs(), getTokenList()])
      .then((result) => {
        prepareRemoteConfig(result[0], result[1]);
        setLoadingState(false);
      })
      .catch((error) => {
        setLoadingState(false);
        console.log("error", error);
      });
  }, []);

  useEffect(() => {
    getTransferConfigs().then((config) => {
      dispatch(setTransferConfigForBridge(config));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chains.length === 0 || JSON.stringify(chainToken) === "{}") {
      return;
    }
    setDefaultInfo(chains, chainToken, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chains, chainToken]);

  const prepareRemoteConfig = (
    getConfigsResponse: GetConfigsResponse,
    getTokenListResponse: GetTokenListResponse
  ) => {
    const chainIds = new Set<number>();
    const tokenList = getTokenListResponse.toObject().tokensList;

    tokenList.forEach((tokenInfo) => {
      chainIds.add(tokenInfo.chainId);
    });

    const chainTokenMap = {};
    const localCustomTokenList = getCustomTokenListFromLocalStorage();

    chainIds.forEach((currentChainId) => {
      const currentChainTokenList = tokenList
        .filter((tokenInfo) => {
          return (
            tokenInfo.chainId === currentChainId &&
            !blackListTokens[currentChainId]?.includes(tokenInfo.address)
          );
        })
        .concat(
          localCustomTokenList?.filter(
            (item) =>
              Number(item?.chainId) === Number(currentChainId) &&
              !blackListTokens[currentChainId]?.includes(item.address)
          ) ?? []
        );
      chainTokenMap[currentChainId] = { tokenList: currentChainTokenList };
    });
    dispatch(
      setTransferConfig({
        chains: getConfigsResponse.toObject().chainsList,
        chainToken: chainTokenMap,
      })
    );
  };

  const getCustomTokenListFromLocalStorage = () => {
    const localCustomTokensJson = localStorage.getItem(
      storageConstants.KEY_LOCAL_CUSTOM_TOKENS
    );

    let localCustomTokenList;

    if (localCustomTokensJson) {
      localCustomTokenList = JSON.parse(localCustomTokensJson);
    }

    return localCustomTokenList;
  };

  const saveSelectedTokenForChain = (
    chainId1: number,
    tokenSymbol1: string,
    chainId2: number
  ) => {
    const chainTokenSymbolMapString = localStorage.getItem(
      storageConstants.KEY_PREVIOUS_TOKEN_FOR_CHAIN
    );
    let chainTokenMap = {};
    if (chainTokenSymbolMapString) {
      // eslint-disable-next-line @typescript-eslint/ban-types
      chainTokenMap = JSON.parse(chainTokenSymbolMapString) as {};
    }

    chainTokenMap[chainId1] = tokenSymbol1;
    chainTokenMap[chainId2] = tokenSymbol1;

    localStorage.setItem(
      storageConstants.KEY_PREVIOUS_TOKEN_FOR_CHAIN,
      JSON.stringify(chainTokenMap)
    );
  };

  const getSelectedTokenForChainJSON = () => {
    const chainTokenSymbolMapString = localStorage.getItem(
      storageConstants.KEY_PREVIOUS_TOKEN_FOR_CHAIN
    );
    let chainTokenMap = {};
    if (chainTokenSymbolMapString) {
      // eslint-disable-next-line @typescript-eslint/ban-types
      chainTokenMap = JSON.parse(chainTokenSymbolMapString) as {};
    }
    return chainTokenMap;
  };

  const getDefaultToken = (
    targetSymbol: string,
    nativeToken: Token.AsObject | undefined,
    chainTokenList: Token.AsObject[]
  ): Token.AsObject | undefined => {
    if (targetSymbol.length === 0) {
      return undefined;
    }

    if (
      nativeToken &&
      nativeToken.symbol.toLowerCase() === targetSymbol.toLowerCase()
    ) {
      return nativeToken;
    }
    const targetToken = chainTokenList.find((tokenInfo) => {
      return tokenInfo.symbol.toLowerCase() === targetSymbol.toLowerCase();
    });
    return (
      targetToken ??
      nativeToken ??
      (chainTokenList.length > 0 ? chainTokenList[0] : undefined)
    );
  };

  return (
    <div className="app">
      <Layout className="content">
        <div className="zkContent">
          <BridgeInfo />
          <BridgeContent />
        </div>
      </Layout>
      {isChainShow && (
        <ChainList
          visible={isChainShow}
          onSelectChain={handleSelectChain}
          onCancel={() => dispatch(setIsChainShow(false))}
        />
      )}
      <ProviderModal
        visible={showProviderModal}
        onCancel={handleCloseProviderModal}
      />
    </div>
  );
}

export default Home;
