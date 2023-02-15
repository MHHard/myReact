/* eslint-disable */
import { AptosClient, Types } from "aptos";
import axios from "axios";
import { ethers } from "ethers";
import { storageConstants } from "../../constants/const";
import {
  GetAptosSafeGaurdingInfoRequest,
  GetAptosOriginalVaultSafeGaurdingInfoResponse,
  GetAptosPeggedBridgeSafeGaurdingInfoResponse,
} from "../../constants/type";

const AptosEndpoint = process.env.REACT_APP_APTOS_ENDPOINT ?? "https://fullnode.devnet.aptoslabs.com";

const client = new AptosClient(AptosEndpoint);


export type AptosTransactionResponse = AptosTransactionResponseOnSubmission | AptosTransactionResponseOnError;

// "submission" here means that the transaction is posted on chain and gas is paid.
// However, the status of the transaction might not be "success".
export type AptosTransactionResponseOnSubmission = {
  transactionSubmitted: true;
  transactionHash: string;
};

export type AptosTransactionResponseOnError = {
  transactionSubmitted: false;
  message: string;
};

export const getAptosWalletNetwork: () => Promise<string> = async () => {
  try {
    const network = await (window as any).aptos?.network();
    return network;
  } catch (error) {
    console.log(error);
  }
  return "Devnet"; // default wallet network
};

export const connectAptosWallet = async () => {
  try {
    const _ = await (window as any).aptos.connect();
  } catch (error) {
    console.debug("error", error);
  }
};

export const disconnectAptosWallet = async () => {
  try {
    const _ = await (window as any).aptos.disconnect();
  } catch (error) {
    console.debug("error", error);
  }
};

export const aptosWalletConnected = async (): Promise<boolean> => {
  try {
    const res = await (window as any).aptos.isConnected();
    // if there is an account we are getting a true/false response else we are getting an object type response
    return res;
  } catch {
    //
  }
  return false;
};

export const getAptosWalletAddress = async (): Promise<string | null> => {
  try {
    const data = await (window as any).aptos.account();
    if ("address" in data) return data.address;
  } catch {
    //
  }
  return null;
};

const signAndSubmitTransactionOnAptos = async (
  transactionPayload: Types.TransactionPayload,
  signAndSubmitTransaction: (
    transaction: Types.TransactionPayload,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any,
  ) => Promise<{ hash: Types.HexEncodedBytes }>,
): Promise<AptosTransactionResponse> => {
  const responseOnError: AptosTransactionResponseOnError = {
    transactionSubmitted: false,
    message: "Unknown Error",
  };
  try {
    const connectName = localStorage.getItem(storageConstants.KEY_APTOS_CONNECTED_WALLET_NAME);
    let txHash = "";
    if (connectName?.toLowerCase() === "fewcha") {
      const txnRequest = await (window as any).fewcha.generateTransaction(transactionPayload);
      const signedTx = await (window as any).fewcha.signAndSubmitTransaction(txnRequest.data);
      txHash = signedTx.data;
    } else {
      const response = await signAndSubmitTransaction(transactionPayload);
      txHash = response.hash;
    }

    // transaction succeed
    if (txHash) {
      // await client.waitForTransaction(txHash);
      return {
        transactionSubmitted: true,
        transactionHash: txHash,
      };
    }
    // transaction failed
    return { ...responseOnError, message: txHash };
  } catch (error: any) {
    if (typeof error === "object" && "message" in error) {
      responseOnError.message = error.message;
    }
  }
  return responseOnError;
};

// eslint-disable-next-line
export const queryAptosTransactionStatus = async (transactionHash: string): Promise<any> => {
  try {
    const response = await (window as any).aptos.getTransactionByHash(transactionHash);
    // transaction succeed
    if (!response.success) {
      return { status: 0 };
    }
  } catch (error: any) {
    return { status: 1 };
  }
};

export const registerTokenForAptosAccount = async (
  tokenAddress: string,
  signAndSubmitTransaction: (
    transaction: Types.TransactionPayload,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any,
  ) => Promise<{ hash: Types.HexEncodedBytes }>,
) => {
  const registerTransactionPayload = {
    arguments: [],
    function: "0x1::managed_coin::register",
    type: "entry_function_payload",
    type_arguments: [tokenAddress],
  };
  const response = await signAndSubmitTransactionOnAptos(registerTransactionPayload, signAndSubmitTransaction);
  return response.transactionSubmitted;
};

export const burnTokenFromAptosAccount = async (
  amount: string,
  destinationChainId: number,
  receiverAddress: string,
  nonce: string,
  peggedBridgeContractAddress: string,
  tokenAddress: string,
  signAndSubmitTransaction: (
    transaction: Types.TransactionPayload,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any,
  ) => Promise<{ hash: Types.HexEncodedBytes }>,
) => {
  const burnTransactionPayload = {
    arguments: [amount, destinationChainId.toString(), Array.from(ethers.utils.arrayify(receiverAddress)), nonce],
    function: `0x${peggedBridgeContractAddress}::peg_bridge::burn`,
    type: "entry_function_payload",
    type_arguments: [tokenAddress],
  };

  const response = await signAndSubmitTransactionOnAptos(burnTransactionPayload, signAndSubmitTransaction);
  return response;
};

export const depositTokenFromAptosAccount = async (
  amount: string,
  destinationChainId: number,
  receiverAddress: string,
  nonce: string,
  contractAddress: string,
  tokenAddress: string,
  signAndSubmitTransaction: (
    transaction: Types.TransactionPayload,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any,
  ) => Promise<{ hash: Types.HexEncodedBytes }>,
) => {
  const burnTransactionPayload = {
    arguments: [amount, destinationChainId.toString(), Array.from(ethers.utils.arrayify(receiverAddress)), nonce],
    function: `0x${contractAddress}::vault::deposit`,
    type: "entry_function_payload",
    type_arguments: [tokenAddress],
  };
  const response = await signAndSubmitTransactionOnAptos(burnTransactionPayload, signAndSubmitTransaction);
  return response;
};

export const getAptosResources = async (
  walletAddress: string,
): Promise<any | undefined> => {
  if (!walletAddress) {
    return undefined;
  }
  return client.getAccountResources(walletAddress)
    .catch(error => {
      console.debug("aptos resources error", error)
      return undefined
    })
    .then(accountResource => {
      return accountResource
    })
};

export const getAptosDelayPeriodInfo = async (contractAddress: string): Promise<number | void> => {
  return axios
    .get(
      `${AptosEndpoint}/v1/accounts/${contractAddress}/resource/0x${contractAddress}::delayed_transfer::DelayedTransferState`,
    )
    .then(response => {
      return Number(response.data.data.delay_period);
    })
    .catch(e => {
      console.log("error=>", e);
    });
};

export const getAptosOriginalVaultSafeGuardingInfo = async (
  contractAddress: string,
  tokenAddress: string,
): Promise<GetAptosOriginalVaultSafeGaurdingInfoResponse> => {
  const tableHandle = await axios
    .get(`${AptosEndpoint}/v1/accounts/${contractAddress}/resource/0x${contractAddress}::vault::VaultState`)
    .then(response => {
      return response.data.data.coin_map.handle;
    })
    .catch(error => {
      console.log("error", error);
    });

  const request: GetAptosSafeGaurdingInfoRequest = {
    key_type: "0x1::string::String",
    value_type: `0x${contractAddress}::vault::CoinConfig`,
    key: tokenAddress,
  };

  return axios
    .post(`${AptosEndpoint}/v1/tables/${tableHandle}/item`, {
      ...request,
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });
};

export const getAptosPeggedBridgeSafeGuardingInfo = async (
  contractAddress: string,
  tokenAddress: string,
): Promise<GetAptosPeggedBridgeSafeGaurdingInfoResponse> => {
  const tableHandle = await axios
    .get(`${AptosEndpoint}/v1/accounts/${contractAddress}/resource/0x${contractAddress}::peg_bridge::PegBridgeState`)
    .then(response => {
      return response.data.data.coin_map.handle;
    })
    .catch(error => {
      console.log("error", error);
    });

  const request: GetAptosSafeGaurdingInfoRequest = {
    key_type: "0x1::string::String",
    value_type: `0x${contractAddress}::peg_bridge::CoinConfig`,
    key: tokenAddress,
  };

  return axios
    .post(`${AptosEndpoint}/v1/tables/${tableHandle}/item`, {
      ...request,
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });
};

export const getAptosOriginalVaultWithdrawRelayResult = async (
  contractAddress: string,
  transferId: string,
): Promise<boolean> => {
  const tableHandle = await axios
    .get(`${AptosEndpoint}/v1/accounts/${contractAddress}/resource/0x${contractAddress}::vault::VaultState`)
    .then(response => {
      return response.data.data.records.handle;
    })
    .catch(error => {
      console.log("error", error);
    });

  const request: GetAptosSafeGaurdingInfoRequest = {
    key_type: "vector<u8>",
    value_type: `bool`,
    key: transferId,
  };

  return axios
    .post(`${AptosEndpoint}/v1/tables/${tableHandle}/item`, {
      ...request,
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
      return false;
    });
};

export const getAptosPeggedBridgeMintRelayResult = async (
  contractAddress: string,
  transferId: string,
): Promise<boolean> => {
  const tableHandle = await axios
    .get(`${AptosEndpoint}/v1/accounts/${contractAddress}/resource/0x${contractAddress}::peg_bridge::PegBridgeState`)
    .then(response => {
      return response.data.data.records.handle;
    })
    .catch(_ => {
      return false;
    });

  const request: GetAptosSafeGaurdingInfoRequest = {
    key_type: "vector<u8>",
    value_type: "bool",
    key: transferId,
  };

  return axios
    .post(`${AptosEndpoint}/v1/tables/${tableHandle}/item`, {
      ...request,
    })
    .then(res => {
      return res.data;
    })
    .catch(error => {
      return false;
    });
};

export const submitAptosDepositRefundRequest = async (
  depositContractAddress: string,
  tokenFullAddress: string,
  wdmsg: Uint8Array,
  gatewaySigs: Uint8Array[],
  signers: Uint8Array[],
  powers: string[],
  signAndSubmitTransaction: (
    transaction: Types.TransactionPayload,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any,
  ) => Promise<{ hash: Types.HexEncodedBytes }>,
): Promise<string> => {
  const burnTransactionPayload = {
    arguments: [
      Array.from(wdmsg),
      Array.from(
        gatewaySigs.map(item => {
          return Array.from(item);
        }),
      ),
      Array.from(
        signers.map(item => {
          return Array.from(item);
        }),
      ),
      Array.from(powers),
    ],
    function: `0x${depositContractAddress}::vault::withdraw`,
    type: "entry_function_payload",
    type_arguments: [tokenFullAddress],
  };

  const response = await signAndSubmitTransactionOnAptos(burnTransactionPayload, signAndSubmitTransaction);
  if (response.transactionSubmitted) {
    return response.transactionHash;
  }
  throw response.message;
};

export const submitAptosBurnRefundRequest = async (
  pegBridgeContractAddress: string,
  tokenFullAddress: string,
  wdmsg: Uint8Array,
  gatewaySigs: Uint8Array[],
  signers: Uint8Array[],
  powers: string[],
  signAndSubmitTransaction: (
    transaction: Types.TransactionPayload,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any,
  ) => Promise<{ hash: Types.HexEncodedBytes }>,
): Promise<string> => {
  const burnTransactionPayload = {
    arguments: [
      Array.from(wdmsg),
      Array.from(
        gatewaySigs.map(item => {
          return Array.from(item);
        }),
      ),
      Array.from(
        signers.map(item => {
          return Array.from(item);
        }),
      ),
      Array.from(powers),
    ],
    function: `0x${pegBridgeContractAddress}::peg_bridge::mint`,
    type: "entry_function_payload",
    type_arguments: [tokenFullAddress],
  };

  const response = await signAndSubmitTransactionOnAptos(burnTransactionPayload, signAndSubmitTransaction);
  if (response.transactionSubmitted) {
    return response.transactionHash;
  }
  throw response.message;
};

export const submitAptosRegisterAndMintRequest = async (
  tokenFullAddress: string,
  wdmsg: Uint8Array,
  gatewaySigs: Uint8Array[],
  signers: Uint8Array[],
  powers: string[],
  signAndSubmitTransaction: (
    transaction: Types.TransactionPayload,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any,
  ) => Promise<{ hash: Types.HexEncodedBytes }>,
): Promise<string> => {
  const registerAndMintTransactionPayload = {
    arguments: [
      Array.from(wdmsg),
      Array.from(gatewaySigs.map(item => {
        return Array.from(item)
      })),
      Array.from(signers.map(item => {
        return Array.from(item)
      })),
      Array.from(powers)
    ],
    code: {
      bytecode: "a11ceb0b0500000006010006030617041d06052323074646088c0140000000010102010303010000040105010000050302010002060602010001040204030405060c0a020a0a020a0a020a0401050001060c0109000101040a020a0a020a0a020a0404636f696e067369676e65720a7065675f6272696467650a616464726573735f6f661569735f6163636f756e745f72656769737465726564087265676973746572046d696e7400000000000000000000000000000000000000000000000000000000000000015c341dec2396029a7713cb59decee89635a6f851a5fe528fc39761ec2ddbf99a01000001140a0011000c050b05380009210309050c0b003801050e0b00010b010b020b030b04380202"
    },
    // function: `0x${pegBridgeContractAddress}::peg_bridge::mint`,
    type: 'script_payload',
    type_arguments: [tokenFullAddress],
  }

  const response = await signAndSubmitTransactionOnAptos(registerAndMintTransactionPayload, signAndSubmitTransaction)
  if (response.transactionSubmitted) {
    return response.transactionHash
  }
  throw response.message
}

export const submitAptosProxyRegisterAndMintRequest = async (
  pegBridgeContractAddress: string,
  tokenFullAddress: string,
  wdmsg: Uint8Array,
  gatewaySigs: Uint8Array[],
  signers: Uint8Array[],
  powers: string[],
  signAndSubmitTransaction: (
    transaction: Types.TransactionPayload,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any,
  ) => Promise<{ hash: Types.HexEncodedBytes }>,
): Promise<string> => {
  const registerAndMintTransactionPayload = {
    arguments: [
      Array.from(wdmsg),
      Array.from(gatewaySigs.map(item => {
        return Array.from(item)
      })),
      Array.from(signers.map(item => {
        return Array.from(item)
      })),
      Array.from(powers)
    ],
    function: `0x${pegBridgeContractAddress}::peg_bridge::register_mint`,
    type: 'script_payload',
    type_arguments: [tokenFullAddress],
  }

  const response = await signAndSubmitTransactionOnAptos(registerAndMintTransactionPayload, signAndSubmitTransaction)
  if (response.transactionSubmitted) {
    return response.transactionHash
  }
  throw response.message
}

export const getAptosBurnTotalSupply = async (
  contractAddress: string,
  tokenAddress: string,
): Promise<string> => {
  return axios
    .get(`${AptosEndpoint}/v1/accounts/0x${contractAddress}/resource/0x1::coin::CoinInfo<${tokenAddress}>`)
    .then(response => {
      return response.data.data.supply.vec[0].integer.vec[0].value;
    })
    .catch(error => {
      console.log("aptos error", error)
      return "";
    });
}



