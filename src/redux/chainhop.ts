import {
  GetConfigsRequest,
  GetConfigsResponse,
  GetHistoryRequest,
  GetHistoryResponse,
  GetStatusRequest,
  GetStatusResponse,
  GetTokenListRequest,
  QuoteRequest,
  QuoteResponse,
  SwapRequest,
  SwapResponse,
} from "../proto/chainhop/web_pb";
import { webServiceClient } from "./grpcClients";

/* eslint-disable camelcase */
// const preFix = { pathPrefix: process.env.REACT_APP_SERVER_URL }; // 域名

export const getSwapConfigs = (): Promise<GetConfigsResponse> => {
  const request = new GetConfigsRequest();
  return webServiceClient.getConfigs(request, {
    "Access-Control-Allow-Origin": "*",
  });
};

// export const getEstimateFee = (
//   reqParams: EstimateFeeRequest
// ): Promise<EstimateFeeResponse> => {
//   return client.estimateFee(reqParams, { "Access-Control-Allow-Origin": "*" });
// };
export const queryFeeAndError = (
  reqParams: QuoteRequest
): Promise<QuoteResponse> => {
  return webServiceClient.quote(reqParams, {
    "Access-Control-Allow-Origin": "*",
  });
};
export const getSwapData = (reqParams: SwapRequest): Promise<SwapResponse> => {
  return webServiceClient.swap(reqParams, {
    "Access-Control-Allow-Origin": "*",
  });
};

export const getHistory = (
  reqParams: GetHistoryRequest
): Promise<GetHistoryResponse> => {
  return webServiceClient.getHistory(reqParams, {
    "Access-Control-Allow-Origin": "*",
  });
};

export const getCcSwapStatus = (
  reqParams: GetStatusRequest
): Promise<GetStatusResponse> => {
  return webServiceClient.getStatus(reqParams, {
    "Access-Control-Allow-Origin": "*",
  });
};

export const getTokenList = () => {
  const request = new GetTokenListRequest();
  return webServiceClient.getTokenList(request, {
    "Access-Control-Allow-Origin": "*",
  });
};
export const markRefRelation = (request) => {
  return webServiceClient.markRefRelation(request, {
    "Access-Control-Allow-Origin": "*",
  });
};

export const tokenUrlList = `[
  {
      "key": "uniswap", 
      "url" : "https://tokens.uniswap.org"
  },
  {
    "key":"pancakeswap-extended",
    "url":"https://tokens.pancakeswap.finance/pancakeswap-extended.json"
  },
  {
    "key":"quickswap",
    "url": "https://unpkg.com/quickswap-default-token-list@1.2.29/build/quickswap-default.tokenlist.json"
  },
  {
    "key": "joe-tokenlist",
    "url": "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/joe.tokenlist.json"
  },
  {
      "key": "compound-finance",
      "url": "https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json"
  },
  {
      "key":"umaproject",
      "url": "https://umaproject.org/uma.tokenlist.json"
  },
  {
      "key":"uniswap-tokenlist-set", 
      "url":"https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json"
  },
  {
      "key": "uniswap-all",
      "url": "https://tokens.coingecko.com/uniswap/all.json"
  },
  {
      "key":"bridge-arbitrum",
      "url": "https://bridge.arbitrum.io/token-list-42161.json"
  },
  {
      "key":"static-optimism",
      "url":"https://static.optimism.io/optimism.tokenlist.json"
  },
  {   
    "key":"spookyswap",
    "url":"https://assets.spooky.fi/spookyswap.json"
  },
  {
    "key":"curve",
    "url": ""
  }
]`;

export const tokenUrlMap = {
  1: ["uniswap", "curve"], // ethereum
  10: ["static-optimism"], // optimism
  56: ["pancakeswap-extended"], // bnb chain
  137: ["quickswap", "curve"], // polygon
  43114: ["joe-tokenlist", "curve"], // Avalanche
  42161: [
    "curve",
    "compound-finance",
    "umaproject",
    // "yearn-science",
    "uniswap-tokenlist-set",
    "uniswap-all",
    "bridge-arbitrum",
    "static-optimism",
  ], // Arbitrum
  250: ["spookyswap", "curve"], // Fantom
};
export const dexNameMap = {
  cbridge: "cBridge",
  anyswap: "Multichain",
  stargate: "Stargate",
  UniswapV3: "Uniswap V3",
  across: "Across",
  hyphen: "Hyphen",
  hop: "Hop",
};
export const getDexName = (nameText) => {
  let newName = dexNameMap[nameText];
  if (!newName) {
    newName = nameText;
  }
  return newName;
};
export const getmins = (etaSeconds) => {
  let min = 0;
  if (!etaSeconds) {
    return 1;
  }
  min = Math.floor(etaSeconds / 60);
  const remainder = etaSeconds % 60;
  if (remainder > 30) {
    min += 1;
  }
  if (Number(etaSeconds) < 60) {
    min = 1;
  }
  if (Number(etaSeconds) >= 20 * 60) {
    min = 20;
  }
  return min;
};

// cache token list item icon
export const cacheIcons = {};
export const uuid = () => {
  const uid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  return uid;
};
