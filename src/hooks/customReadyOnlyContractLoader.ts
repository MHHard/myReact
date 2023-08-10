import { useEffect, useState } from "react";

import { Provider } from "@ethersproject/abstract-provider";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";
import { Contract } from "@ethersproject/contracts";
import { isAddress } from "ethers/lib/utils";
import { useWeb3Context } from "../providers/Web3ContextProvider";

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
  contractAddress: string,
  factory: { connect(addressParameter: string, signerOrProviderParameter: Signer | Provider): Contract },
): Contract | undefined {
  const [contract, setContract] = useState<Contract>();
  const { getNetworkById } = useWeb3Context();
  useEffect(() => {
    async function loadContract() {
      if (chainId && factory && contractAddress && isAddress(contractAddress)) {
        try {
          const rpcUrl = getNetworkById(chainId)?.rpcUrl;
          if (rpcUrl) {
            const provider = await new StaticJsonRpcProvider(rpcUrl);
            const customContract = await factory.connect(contractAddress, provider);
            setContract(customContract);
          }
        } catch (e) {
          console.log("Error loading custom contract", e);
        }
      }
    }
    loadContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractAddress, chainId]);
  return contract;
}

export const readOnlyContract = async (
  chainId: number | undefined,
  contractAddress: string,
  factory: {
    // eslint-disable-next-line
    connect(address: string, signerOrProvider: Signer | Provider): Contract;
  },
  getNetworkById,
) => {
  if (chainId && factory && contractAddress && isAddress(contractAddress)) {
    const rpcUrl = getNetworkById(chainId)?.rpcUrl;
    if (rpcUrl) {
      const provider = await new StaticJsonRpcProvider(rpcUrl);
      const customContract = await factory.connect(contractAddress, provider);
      return customContract;
    }
    return undefined;
  }
  return undefined;
};
