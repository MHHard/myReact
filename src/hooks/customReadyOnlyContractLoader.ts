/* eslint-disable no-shadow */
import { useEffect, useState } from "react";

import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getNetworkById } from "../constants/network";

/**
 * Loads a custom contract in read-only mode.
 *
 * @param signerOrProvider A Signer or a Provider.
 * @param address The contract address.
 * @param factory The contract factory.
 * @returns The contract.
 */
export default function useReadOnlyCustomContractLoader(
  chainId: number | undefined,
  address: string | undefined,
  factory: {
    connect(address: string, signerOrProvider: Signer | Provider): Contract;
  }
): Contract | undefined {
  const [contract, setContract] = useState<Contract>();
  useEffect(() => {
    async function loadContract() {
      if (chainId && factory && address) {
        try {
          const rpcUrl = getNetworkById(chainId)?.rpcUrl;
          if (rpcUrl) {
            const provider = await new JsonRpcProvider(rpcUrl);
            const customContract = await factory.connect(address, provider);
            setContract(customContract);
          }
        } catch (e) {
          console.log("Error loading custom contract", e);
        }
      }
    }
    loadContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, chainId]);
  return contract;
}

export const readOnlyContract = async (
  signerOrProvider: Signer | Provider | undefined,
  address: string,
  factory: {
    connect(address: string, signerOrProvider: Signer | Provider): Contract;
  }
) => {
  if (typeof signerOrProvider !== "undefined" && factory && address) {
    const customContract = await factory.connect(address, signerOrProvider);
    return customContract;
  }
  return undefined;
};
