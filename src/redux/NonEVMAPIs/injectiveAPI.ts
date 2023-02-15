/* eslint-disable camelcase */
import { decodeBech32, encodeBech32 } from "@terra-money/amino-js";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";

import {
  ChainRestAuthApi,
  BaseAccount,
  TxRaw,
  DirectSignResponse,
  createTxRawFromSigResponse,
  TxRestClient,
  MsgExecuteContract,
  createTransactionWithSigners,
} from "@injectivelabs/sdk-ts";
import { DEFAULT_STD_FEE } from "@injectivelabs/utils";
import { ChainId } from "@injectivelabs/ts-types";
import { Chain, Token, TokenInfo } from "../../constants/type";

const chainId = process.env.REACT_APP_ENV_TYPE === "test" ? ChainId.Testnet : ChainId.Mainnet;
const restEndpoint = process.env.REACT_APP_INJECTIVE_LCD || "";
const chainRestAuthApi = new ChainRestAuthApi(restEndpoint);

export const signTransaction = async (tx: TxRaw, cId, address, accountNumber): Promise<DirectSignResponse> => {
  const response = window.walletStrategy.signCosmosTransaction({
    txRaw: tx,
    accountNumber,
    chainId: cId,
    address,
  });

  return response;
};

export const injDeposit = async (
  senderAddress: string,
  receiverAddress: string,
  tokenAddress: string,
  contractAddress: string,
  toChain: Chain,
  value: BigNumber,
  nonce: number,
) => {
  const accountDetailsResponse = await chainRestAuthApi.fetchAccount(senderAddress);
  const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse);
  const msgIn = {
    dst_chid: toChain?.id ?? 0,
    mint_acnt: receiverAddress.replace("0x", ""),
    nonce,
  };
  const cw20MintData = {
    send: {
      contract: convertCanonicalToInjAddress(contractAddress),
      msg: Buffer.from(JSON.stringify(msgIn)).toString("base64"),
      amount: value.toString(),
    },
  };
  const msg = MsgExecuteContract.fromJSON({
    contractAddress: convertCanonicalToInjAddress(tokenAddress),
    sender: senderAddress,
    msg: cw20MintData,
  });
  const publicKey = await window?.walletStrategy.getPubKey();
  const { txRaw } = createTransactionWithSigners({
    message: msg.toDirectSign(),
    memo: "",
    chainId,
    fee: DEFAULT_STD_FEE,
    signers: {
      pubKey: publicKey,
      sequence: parseInt(accountDetailsResponse.account.base_account.sequence, 10),
      accountNumber: parseInt(accountDetailsResponse.account.base_account.account_number, 10),
    },
  });
  const directSignResponse = await signTransaction(txRaw, chainId, senderAddress, baseAccount.accountNumber);
  const txService = new TxRestClient(restEndpoint);
  const txRaw2 = createTxRawFromSigResponse(directSignResponse);
  return txService.broadcast(txRaw2);
};

export const injDepositRefund = async (
  senderAddress: string,
  contractAddress: string,
  pbmsg: string,
  sigs: string[],
) => {
  const accountDetailsResponse = await chainRestAuthApi.fetchAccount(senderAddress);
  const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse);
  const callData = {
    withdraw: {
      pbmsg,
      sigs,
    },
  };
  const msg = MsgExecuteContract.fromJSON({
    contractAddress: convertCanonicalToInjAddress(contractAddress),
    sender: senderAddress,
    msg: callData,
  });
  const publicKey = await window?.walletStrategy.getPubKey();
  const { txRaw } = createTransactionWithSigners({
    message: msg.toDirectSign(),
    memo: "",
    chainId,
    fee: DEFAULT_STD_FEE,
    signers: {
      pubKey: publicKey,
      sequence: parseInt(accountDetailsResponse.account.base_account.sequence, 10),
      accountNumber: parseInt(accountDetailsResponse.account.base_account.account_number, 10),
    },
  });
  const directSignResponse = await signTransaction(txRaw, chainId, senderAddress, baseAccount.accountNumber);
  const txService = new TxRestClient(restEndpoint);
  const txRaw2 = createTxRawFromSigResponse(directSignResponse);
  return txService.broadcast(txRaw2);
};

export const injBurnRefund = async (senderAddress: string, contractAddress: string, pbmsg: string, sigs: string[]) => {
  const accountDetailsResponse = await chainRestAuthApi.fetchAccount(senderAddress);
  const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse);
  const callData = {
    mint: {
      pbmsg,
      sigs,
    },
  };
  const msg = MsgExecuteContract.fromJSON({
    contractAddress: convertCanonicalToInjAddress(contractAddress),
    sender: senderAddress,
    msg: callData,
  });
  const publicKey = await window?.walletStrategy.getPubKey();
  const { txRaw } = createTransactionWithSigners({
    message: msg.toDirectSign(),
    memo: "",
    chainId,
    fee: DEFAULT_STD_FEE,
    signers: {
      pubKey: publicKey,
      sequence: parseInt(accountDetailsResponse.account.base_account.sequence, 10),
      accountNumber: parseInt(accountDetailsResponse.account.base_account.account_number, 10),
    },
  });
  const directSignResponse = await signTransaction(txRaw, chainId, senderAddress, baseAccount.accountNumber);
  const txService = new TxRestClient(restEndpoint);
  const txRaw2 = createTxRawFromSigResponse(directSignResponse);
  return txService.broadcast(txRaw2);
};

export const injDepositNative = async (
  senderAddress: string,
  receiverAddress: string,
  contractAddress: string,
  toChain: Chain,
  value: BigNumber,
  nonce: number,
  nativeTokenSymbol: string,
) => {
  const accountDetailsResponse = await chainRestAuthApi.fetchAccount(senderAddress);
  const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse);

  const msg = MsgExecuteContract.fromJSON({
    contractAddress: convertCanonicalToInjAddress(contractAddress),
    sender: senderAddress,
    msg: {
      deposit_native: {
        dst_chid: toChain?.id ?? 0,
        mint_acnt: receiverAddress.replace("0x", ""),
        nonce,
      },
    },
    funds: [{ denom: getInjNativeTokenSymbol(nativeTokenSymbol), amount: value.toString() }],
  });
  const publicKey = await window?.walletStrategy.getPubKey();
  const { txRaw } = createTransactionWithSigners({
    message: msg.toDirectSign(),
    memo: "",
    chainId,
    fee: DEFAULT_STD_FEE,
    signers: {
      pubKey: publicKey,
      sequence: parseInt(accountDetailsResponse.account.base_account.sequence, 10),
      accountNumber: parseInt(accountDetailsResponse.account.base_account.account_number, 10),
    },
  });
  const directSignResponse = await signTransaction(txRaw, chainId, senderAddress, baseAccount.accountNumber);
  const txService = new TxRestClient(restEndpoint);
  const txRaw2 = createTxRawFromSigResponse(directSignResponse);
  return txService.broadcast(txRaw2);

  /** Block Details */
  // const chainRestTendermintApi = new ChainRestTendermintApi(restEndpoint);
  // const latestBlock = await chainRestTendermintApi.fetchLatestBlock();
  // const latestHeight = latestBlock.header.height;
  // const timeoutHeight = new BigNumberInBase(latestHeight).plus(DEFAULT_BLOCK_TIMEOUT_HEIGHT);

  /** Prepare the Transaction * */
  // const msgs = [msg];
  // const { txRaw, signDoc } = createTransaction({
  //   pubKey,
  //   chainId,
  //   fee: DEFAULT_STD_FEE,
  //   message: msgs.map(m => m.toDirectSign()),
  //   sequence: baseAccount.sequence,
  //   timeoutHeight: timeoutHeight.toNumber(),
  //   accountNumber: baseAccount.accountNumber,
  // });
  // const directSignResponse = await signTransaction(
  //   txRaw,
  //   chainId,
  //   injectiveAddress,
  //   parseInt(accountDetailsResponse.account.base_account.account_number, 10),
  // );
  // const txHash = await walletStrategy.sendTransaction(directSignResponse, {
  //   address: injectiveAddress,
  //   chainId: ChainId.Testnet,
  // });
  // const offlineSigner2 = await window.keplr?.getOfflineSigner(chainId);
  // const directSignResponse = await offlineSigner2.signDirect(injectiveAddress, signDoc.toObject());

  // const directSignResponse = await offlineSigner.signDirect(injectiveAddress, signDoc);
  // const txRaw2 = createTxRawFromSigResponse(directSignResponse);
  // const txHash = await broadcastTx(ChainId.Testnet, txRaw2);
  // const response = await new TxRestClient(restEndpoint).fetchTxPoll(txHash);
  // const txHash = await broadcastTx(ChainId.Testnet, directSignResponse);
  // const response = await new TxRestClient(restEndpoint).fetchTxPoll(txHash);
  // console.log(12345 + "txHash", txHash);
  // const txHash = await broadcastTx(ChainId.Testnet, txRaw2); // invalid mode //Cannot read properties of undefined (reading 'apis')
  // const txHash = await window?.walletStrategy.sendTransaction(txRaw2, {
  //   address: injectiveAddress,
  //   chainId: ChainId.Testnet,
  // }); // Cannot read properties of undefined (reading 'apis')
  // return undefined;
};

export const injBurn = async (
  senderAddress: string,
  receiverAddress: string,
  tokenAddress: string,
  toChain: Chain,
  nonce: number,
  value: BigNumber,
) => {
  const accountDetailsResponse = await chainRestAuthApi.fetchAccount(senderAddress);
  const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse);
  const msgIn = {
    to_chid: toChain?.id ?? 0,
    to_acnt: receiverAddress.replace("0x", ""),
    nonce,
  };
  const cw20BurnData = {
    burn: {
      sender: senderAddress,
      msg: Buffer.from(JSON.stringify(msgIn)).toString("base64"),
      amount: value.toString(),
    },
  };
  const msg = MsgExecuteContract.fromJSON({
    contractAddress: convertCanonicalToInjAddress(tokenAddress),
    sender: senderAddress,
    msg: cw20BurnData,
  });
  const publicKey = await window?.walletStrategy.getPubKey();
  const { txRaw } = createTransactionWithSigners({
    message: msg.toDirectSign(),
    memo: "",
    chainId,
    fee: DEFAULT_STD_FEE,
    signers: {
      pubKey: publicKey,
      sequence: parseInt(accountDetailsResponse.account.base_account.sequence, 10),
      accountNumber: parseInt(accountDetailsResponse.account.base_account.account_number, 10),
    },
  });
  const directSignResponse = await signTransaction(txRaw, chainId, senderAddress, baseAccount.accountNumber);
  const txService = new TxRestClient(restEndpoint);
  const txRaw2 = createTxRawFromSigResponse(directSignResponse);
  return txService.broadcast(txRaw2);
};

const injNativeTokenSymbolMap_testnet = {
  inj: "inj",
  INJ: "inj",
};
const injNativeTokenSymbolMap_mainnet = {
  INJ: "inj",
};
export const getInjNativeTokenSymbol = (symbol: string) => {
  const symbolMap =
    process.env.REACT_APP_ENV_TYPE === "test" ? injNativeTokenSymbolMap_testnet : injNativeTokenSymbolMap_mainnet;
  return symbolMap[symbol];
};

export const getInjNativeTokenBalance = async (injAddress: string, token: Token) => {
  try {
    const cosmWasmClient = await CosmWasmClient.connect(`${process.env.REACT_APP_INJECTIVE_RPC}`);
    const result = await cosmWasmClient.getBalance(injAddress, getInjNativeTokenSymbol(token.symbol));
    return Number(formatUnits(result.amount, token.decimal ?? 6));
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const getInjTokenBalance = async (token: Token, injAddress: string) => {
  const decodeAddr = convertCanonicalToInjAddress(token.address);
  console.debug("toekn decodeAddr", decodeAddr);
  try {
    const queryBody = {
      balance: { address: injAddress },
    };
    const cosmWasmClient = await CosmWasmClient.connect(`${process.env.REACT_APP_INJECTIVE_RPC}`);
    const result = await cosmWasmClient.queryContractSmart(decodeAddr, queryBody);
    return Number(formatUnits(result.balance, token.decimal ?? 6));
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const convertCanonicalToInjAddress = (canonicalAddress: string) => {
  if (canonicalAddress.includes("inj")) {
    console.log("wrong address input", canonicalAddress);
    return canonicalAddress;
  }

  const no0xAddress = canonicalAddress.toLowerCase().replace("0x", "");
  return encodeBech32("inj", Uint8Array.from(Buffer.from(no0xAddress, "hex")));
};

export const convertInjToCanonicalAddress = (address: string) => {
  if (!address.includes("inj")) {
    console.log("wrong address input", address);
    return address;
  }
  const decode = decodeBech32(address);
  return "0x" + Buffer.from(decode[1]).toString("hex");
};

export const getInjBurnMinMax = async (contractAddress: string, token: Token) => {
  try {
    const queryMinBody = {
      min_burn: { token: convertCanonicalToInjAddress(token.address) },
    };
    const queryMaxBody = {
      max_burn: { token: convertCanonicalToInjAddress(token.address) },
    };
    const decodeAddr = convertCanonicalToInjAddress(contractAddress);
    const cosmWasmClient = await CosmWasmClient.connect(`${process.env.REACT_APP_INJECTIVE_RPC}`);
    const getMinBurnPromise = cosmWasmClient.queryContractSmart(decodeAddr, queryMinBody);
    const getMaxBurnPromise = cosmWasmClient.queryContractSmart(decodeAddr, queryMaxBody);
    const results = await Promise.all([getMinBurnPromise, getMaxBurnPromise]);
    console.log("min_burn,max_burnInj999999", contractAddress, results);
    return { min_burn: results[0], max_burn: results[1] };
  } catch (error) {
    console.error(error);
    return { min_burn: 0, max_burn: 0 };
  }
};

export const getInjDepositMinMax = async (contractAddress: string, token: Token) => {
  try {
    const queryMinBody = {
      min_deposit: { token: convertCanonicalToInjAddress(token.address) },
    };
    const queryMaxBody = {
      max_deposit: { token: convertCanonicalToInjAddress(token.address) },
    };
    const decodeAddr = convertCanonicalToInjAddress(contractAddress);
    const cosmWasmClient = await CosmWasmClient.connect(`${process.env.REACT_APP_INJECTIVE_RPC}`);
    const getMinBurnPromise = cosmWasmClient.queryContractSmart(decodeAddr, queryMinBody);
    const getMaxBurnPromise = cosmWasmClient.queryContractSmart(decodeAddr, queryMaxBody);
    const results = await Promise.all([getMinBurnPromise, getMaxBurnPromise]);
    console.log("min_deposit,max_depositInj999999", contractAddress, results);
    return { min_deposit: results[0], max_deposit: results[1] };
  } catch (error) {
    console.error(error);
    return { min_deposit: 0, max_deposit: 0 };
  }
};

export const getInjSafeGuardingInfo = async (contractAddress: string, tokenAddress: string) => {
  try {
    const queryMinBody = {
      epoch_volume_cap: { token: convertCanonicalToInjAddress(tokenAddress) },
    };
    const queryMaxBody = {
      delay_threshold: { token: convertCanonicalToInjAddress(tokenAddress) },
    };
    const queryPerBody = {
      delay_period: { token: convertCanonicalToInjAddress(tokenAddress) },
    };
    const decodeAddr = convertCanonicalToInjAddress(contractAddress);
    const cosmWasmClient = await CosmWasmClient.connect(`${process.env.REACT_APP_INJECTIVE_RPC}`);
    const getValCapPromise = cosmWasmClient.queryContractSmart(decodeAddr, queryMinBody);
    const getDelayPromise = cosmWasmClient.queryContractSmart(decodeAddr, queryMaxBody);
    const getPerPromise = cosmWasmClient.queryContractSmart(decodeAddr, queryPerBody);
    const results = await Promise.all([getValCapPromise, getDelayPromise, getPerPromise]);
    console.log("vol_cap,delay_threshold,delay_periodInj999999", results);
    return { vol_cap: results[0], delay_threshold: results[1], delay_period: results[2] };
  } catch (error) {
    console.error(error);
    return { vol_cap: "0", delay_threshold: "0", delay_period: "0" };
  }
};

export const getInjOriginalVaultWithdrawRelayResult = async (
  destinationChainContractAddress: string,
  destinationTransferId: string,
) => {
  try {
    const queryMaxBody = {
      record: { id: destinationTransferId.replace("0x", ""), is_deposit: false },
    };
    const decodeAddr = convertCanonicalToInjAddress(destinationChainContractAddress);
    const cosmWasmClient = await CosmWasmClient.connect(`${process.env.REACT_APP_INJECTIVE_RPC}`);
    const result = await cosmWasmClient.queryContractSmart(decodeAddr, queryMaxBody);
    console.log("getInjOriginalVaultWithdrawRelayResultInj999999", destinationChainContractAddress, result);
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getInjPeggedBridgeMintRelayResult = async (
  destinationChainContractAddress: string,
  destinationTransferId: string,
) => {
  try {
    const queryMaxBody = {
      record: { id: destinationTransferId.replace("0x", ""), is_burn: false },
    };
    const decodeAddr = convertCanonicalToInjAddress(destinationChainContractAddress);
    const cosmWasmClient = await CosmWasmClient.connect(`${process.env.REACT_APP_INJECTIVE_RPC}`);
    const result = await cosmWasmClient.queryContractSmart(decodeAddr, queryMaxBody);
    console.log("getInjPeggedBridgeMintRelayResultInj999999", destinationChainContractAddress, result);
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

export const getInjBurnTotalSupply = async (contractAddress: string, tokenAddress: string) => {
  try {
    const queryMinBody = {
      supply: { token: convertCanonicalToInjAddress(tokenAddress) },
    };
    const decodeAddr = convertCanonicalToInjAddress(contractAddress);
    const cosmWasmClient = await CosmWasmClient.connect(`${process.env.REACT_APP_INJECTIVE_RPC}`);
    const result = await cosmWasmClient.queryContractSmart(decodeAddr, queryMinBody);
    console.log("getInjBurnTotalSupplyInj999999", result);
    return result;
  } catch (error) {
    console.error(error);
    return "";
  }
};
