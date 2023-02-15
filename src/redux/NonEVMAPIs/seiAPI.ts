/* eslint-disable camelcase */
import { decodeBech32, encodeBech32 } from "@terra-money/amino-js";
import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate/build/fee";

import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { Chain, Token, TokenInfo } from "../../constants/type";

export const seiDeposit = async (
  senderAddress: string,
  receiverAddress: string,
  tokenAddress: string,
  contractAddress: string,
  toChain: Chain,
  value: BigNumber,
  nonce: number,
  offerlineSinger: OfflineSigner,
) => {
  const gasPrice = GasPrice.fromString("0usei");
  if (!offerlineSinger) {
    return undefined;
  }
  const signingCosmWasmClient = await SigningCosmWasmClient.connectWithSigner(
    process.env.REACT_APP_SEI_RPC || "",
    offerlineSinger,
    {
      gasPrice,
    },
  );
  const msg = {
    dst_chid: toChain?.id ?? 0,
    mint_acnt: receiverAddress.replace("0x", ""),
    nonce,
  };
  const cw20MintData = {
    send: {
      contract: convertCanonicalToSeiAddress(contractAddress),
      msg: Buffer.from(JSON.stringify(msg)).toString("base64"),
      amount: value.toString(),
    },
  };
  return signingCosmWasmClient.execute(senderAddress, convertCanonicalToSeiAddress(tokenAddress), cw20MintData, "auto");
};

export const seiDepositRefund = async (
  senderAddress: string,
  contractAddress: string,
  pbmsg: string,
  sigs: string[],
  offerlineSinger: OfflineSigner,
) => {
  const gasPrice = GasPrice.fromString("0usei");
  if (!offerlineSinger) {
    return undefined;
  }
  const signingCosmWasmClient = await SigningCosmWasmClient.connectWithSigner(
    process.env.REACT_APP_SEI_RPC || "",
    offerlineSinger,
    {
      gasPrice,
    },
  );
  const callData = {
    withdraw: {
      pbmsg,
      sigs,
    },
  };
  return signingCosmWasmClient.execute(senderAddress, convertCanonicalToSeiAddress(contractAddress), callData, "auto");
};
export const seiBurnRefund = async (
  senderAddress: string,
  contractAddress: string,
  pbmsg: string,
  sigs: string[],
  offerlineSinger: OfflineSigner,
) => {
  const gasPrice = GasPrice.fromString("0usei");
  if (!offerlineSinger) {
    return undefined;
  }
  const signingCosmWasmClient = await SigningCosmWasmClient.connectWithSigner(
    process.env.REACT_APP_SEI_RPC || "",
    offerlineSinger,
    {
      gasPrice,
    },
  );
  const callData = {
    mint: {
      pbmsg,
      sigs,
    },
  };
  return signingCosmWasmClient.execute(senderAddress, convertCanonicalToSeiAddress(contractAddress), callData, "auto");
};

export const seiDepositNative = async (
  senderAddress: string,
  receiverAddress: string,
  contractAddress: string,
  toChain: Chain,
  value: BigNumber,
  nonce: number,
  nativeTokenSymbol: string,
  offerlineSinger: OfflineSigner,
) => {
  const gasPrice = GasPrice.fromString("0usei");
  if (!offerlineSinger) {
    return undefined;
  }
  const signingCosmWasmClient = await SigningCosmWasmClient.connectWithSigner(
    process.env.REACT_APP_SEI_RPC || "",
    offerlineSinger,
    {
      gasPrice,
    },
  );
  const msgData = {
    deposit_native: {
      dst_chid: toChain?.id ?? 0,
      mint_acnt: receiverAddress.replace("0x", ""),
      nonce,
    },
  };
  return signingCosmWasmClient.execute(
    senderAddress,
    convertCanonicalToSeiAddress(contractAddress),
    msgData,
    "auto",
    undefined,
    [{ denom: getSeiNativeTokenSymbol(nativeTokenSymbol), amount: value.toString() }],
  );
};

export const seiBurn = async (
  senderAddress: string,
  receiverAddress: string,
  tokenAddress: string,
  toChain: Chain,
  nonce: number,
  value: BigNumber,
  offerlineSinger: OfflineSigner,
) => {
  const gasPrice = GasPrice.fromString("0usei");
  if (!offerlineSinger) {
    return undefined;
  }

  const signingCosmWasmClient = await SigningCosmWasmClient.connectWithSigner(
    process.env.REACT_APP_SEI_RPC || "",
    offerlineSinger,
    {
      gasPrice,
    },
  );
  const msg = {
    to_chid: toChain?.id ?? 0,
    to_acnt: receiverAddress.replace("0x", ""),
    nonce,
  };
  const cw20BurnData = {
    burn: {
      sender: senderAddress,
      msg: Buffer.from(JSON.stringify(msg)).toString("base64"),
      amount: value.toString(),
    },
  };

  return signingCosmWasmClient.execute(senderAddress, convertCanonicalToSeiAddress(tokenAddress), cw20BurnData, "auto");
};

const seiNativeTokenSymbolMap_testnet = {
  usei: "usei",
  uceler: "factory/sei174t9p63nzlmsycmd9x9zxx3ejq9lp2y9f69rp9/uceler",
  WBTC: "factory/sei174t9p63nzlmsycmd9x9zxx3ejq9lp2y9f69rp9/WBTC-satoshi",
};
const seiNativeTokenSymbolMap_mainnet = {
  usei: "usei",
  uceler: "factory/sei174t9p63nzlmsycmd9x9zxx3ejq9lp2y9f69rp9/uceler",
};
export const getSeiNativeTokenSymbol = (symbol: string) => {
  const symbolMap =
    process.env.REACT_APP_ENV_TYPE === "test" ? seiNativeTokenSymbolMap_testnet : seiNativeTokenSymbolMap_mainnet;
  return symbolMap[symbol];
};

export const getSeiNativeTokenBalance = async (seiAddress: string, token: Token) => {
  try {
    const cosmWasmClient = await CosmWasmClient.connect(`${process.env.REACT_APP_SEI_RPC}`);
    const result = await cosmWasmClient.getBalance(seiAddress, getSeiNativeTokenSymbol(token.symbol));
    return Number(formatUnits(result.amount, token.decimal ?? 6));
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const getSeiTokenBalance = async (token: Token, seiAddress: string) => {
  const decodeAddr = convertCanonicalToSeiAddress(token.address);
  try {
    const queryBody = {
      balance: { address: seiAddress },
    };
    // const queryClient = await QueryClient.getQueryClient("https://sei-chain-devnet.com/sei-chain-app");
    // const aaa = await queryClient.cosmos.bank.v1beta1.allBalances({ address: seiAddress });
    const cosmWasmClient = await CosmWasmClient.connect(`${process.env.REACT_APP_SEI_RPC}`);
    const result = await cosmWasmClient.queryContractSmart(decodeAddr, queryBody);
    return Number(formatUnits(result.balance, token.decimal ?? 6));
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const convertCanonicalToSeiAddress = (canonicalAddress: string) => {
  if (canonicalAddress.includes("sei")) {
    console.log("wrong address input", canonicalAddress);
    return canonicalAddress;
  }

  const no0xAddress = canonicalAddress.toLowerCase().replace("0x", "");
  return encodeBech32("sei", Uint8Array.from(Buffer.from(no0xAddress, "hex")));
};

export const convertSeiToCanonicalAddress = (address: string) => {
  if (!address.includes("sei")) {
    console.log("wrong address input", address);
    return address;
  }
  const decode = decodeBech32(address);
  return "0x" + Buffer.from(decode[1]).toString("hex");
};

export const getSeiBurnMinMax = async (contractAddress: string, token: Token) => {
  try {
    const queryMinBody = {
      min_burn: { token: convertCanonicalToSeiAddress(token.address) },
    };
    const queryMaxBody = {
      max_burn: { token: convertCanonicalToSeiAddress(token.address) },
    };
    const decodeAddr = convertCanonicalToSeiAddress(contractAddress);
    const cosmWasmClient = await CosmWasmClient.connect(`${process.env.REACT_APP_SEI_RPC}`);
    const getMinBurnPromise = cosmWasmClient.queryContractSmart(decodeAddr, queryMinBody);
    const getMaxBurnPromise = cosmWasmClient.queryContractSmart(decodeAddr, queryMaxBody);
    const results = await Promise.all([getMinBurnPromise, getMaxBurnPromise]);
    console.log("min_burn,max_burnSei999999", contractAddress, results);
    return { min_burn: results[0], max_burn: results[1] };
  } catch (error) {
    console.error(error);
    return { min_burn: 0, max_burn: 0 };
  }
};

export const getSeiDepositMinMax = async (contractAddress: string, token: Token) => {
  try {
    const queryMinBody = {
      min_deposit: { token: convertCanonicalToSeiAddress(token.address) },
    };
    const queryMaxBody = {
      max_deposit: { token: convertCanonicalToSeiAddress(token.address) },
    };
    const decodeAddr = convertCanonicalToSeiAddress(contractAddress);
    const cosmWasmClient = await CosmWasmClient.connect(`${process.env.REACT_APP_SEI_RPC}`);
    const getMinBurnPromise = cosmWasmClient.queryContractSmart(decodeAddr, queryMinBody);
    const getMaxBurnPromise = cosmWasmClient.queryContractSmart(decodeAddr, queryMaxBody);
    const results = await Promise.all([getMinBurnPromise, getMaxBurnPromise]);
    console.log("min_deposit,max_depositSei999999", contractAddress, results);
    return { min_deposit: results[0], max_deposit: results[1] };
  } catch (error) {
    console.error(error);
    return { min_deposit: 0, max_deposit: 0 };
  }
};

export const getSeiSafeGuardingInfo = async (contractAddress: string, tokenAddress: string) => {
  try {
    const queryMinBody = {
      epoch_volume_cap: { token: convertCanonicalToSeiAddress(tokenAddress) },
    };
    const queryMaxBody = {
      delay_threshold: { token: convertCanonicalToSeiAddress(tokenAddress) },
    };
    const queryPerBody = {
      delay_period: { token: convertCanonicalToSeiAddress(tokenAddress) },
    };
    const decodeAddr = convertCanonicalToSeiAddress(contractAddress);
    const cosmWasmClient = await CosmWasmClient.connect(`${process.env.REACT_APP_SEI_RPC}`);
    const getValCapPromise = cosmWasmClient.queryContractSmart(decodeAddr, queryMinBody);
    const getDelayPromise = cosmWasmClient.queryContractSmart(decodeAddr, queryMaxBody);
    const getPerPromise = cosmWasmClient.queryContractSmart(decodeAddr, queryPerBody);
    const results = await Promise.all([getValCapPromise, getDelayPromise, getPerPromise]);
    console.log("vol_cap,delay_threshold,delay_periodSei999999", results);
    return { vol_cap: results[0], delay_threshold: results[1], delay_period: results[2] };
  } catch (error) {
    console.error(error);
    return { vol_cap: "0", delay_threshold: "0", delay_period: "0" };
  }
};

export const getSeiOriginalVaultWithdrawRelayResult = async (
  destinationChainContractAddress: string,
  destinationTransferId: string,
) => {
  try {
    const queryMaxBody = {
      record: { id: destinationTransferId.replace("0x", ""), is_deposit: false },
    };
    const decodeAddr = convertCanonicalToSeiAddress(destinationChainContractAddress);
    const cosmWasmClient = await CosmWasmClient.connect(`${process.env.REACT_APP_SEI_RPC}`);
    const result = await cosmWasmClient.queryContractSmart(decodeAddr, queryMaxBody);
    console.log("getSeiOriginalVaultWithdrawRelayResultSei999999", destinationChainContractAddress, result);
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getSeiPeggedBridgeMintRelayResult = async (
  destinationChainContractAddress: string,
  destinationTransferId: string,
) => {
  try {
    const queryMaxBody = {
      record: { id: destinationTransferId.replace("0x", ""), is_burn: false },
    };
    const decodeAddr = convertCanonicalToSeiAddress(destinationChainContractAddress);
    const cosmWasmClient = await CosmWasmClient.connect(`${process.env.REACT_APP_SEI_RPC}`);
    const result = await cosmWasmClient.queryContractSmart(decodeAddr, queryMaxBody);
    console.log("getSeiPeggedBridgeMintRelayResultSei999999", destinationChainContractAddress, result);
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const checkTokenBelongToChain = (tokenList: TokenInfo[], currentToken: Token) => {
  const filterTokens = tokenList?.filter(token => {
    return (
      token?.token.symbol === currentToken.symbol &&
      token?.token.address?.toLowerCase() === currentToken.address?.toLowerCase()
    );
  });
  return filterTokens?.length > 0;
};

export const getSeiBurnTotalSupply = async (contractAddress: string, tokenAddress: string) => {
  try {
    const queryMinBody = {
      supply: { token: convertCanonicalToSeiAddress(tokenAddress) },
    };
    const decodeAddr = convertCanonicalToSeiAddress(contractAddress);
    const cosmWasmClient = await CosmWasmClient.connect(`${process.env.REACT_APP_SEI_RPC}`);
    const result = await cosmWasmClient.queryContractSmart(decodeAddr, queryMinBody);
    console.log("getSeiBurnTotalSupplySei999999", result);
    return result;
  } catch (error) {
    console.error(error);
    return "";
  }
};
