import { useEffect, useState } from "react";

import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { Contract, ContractFactory } from "@ethersproject/contracts";
import { InfuraProvider, JsonRpcProvider } from "@ethersproject/providers";

import { Bridge } from "../typechain/typechain";
import { Bridge__factory } from "../typechain/typechain/factories/Bridge__factory";
import { Pool } from "../typechain/typechain/Pool";
import { Pool__factory } from "../typechain/typechain/factories/Pool__factory";
import { FarmingRewards } from "../typechain/typechain/FarmingRewards";
import { FarmingRewards__factory } from "../typechain/typechain/factories/FarmingRewards__factory";
import { Faucet__factory } from "../typechain/typechain/factories/Faucet__factory";
import { Faucet } from "../typechain/typechain/Faucet";
import { IncentiveEventsReward, IncentiveEventsReward__factory } from "../typechain/events-typechain";
import { PeggedTokenBridge } from "../typechain/typechain/PeggedTokenBridge";
import { PeggedTokenBridge__factory } from "../typechain/typechain/factories/PeggedTokenBridge__factory";
import { PeggedTokenBridgeV2 } from "../typechain/typechain/PeggedTokenBridgeV2";
import { PeggedTokenBridgeV2__factory } from "../typechain/typechain/factories/PeggedTokenBridgeV2__factory";
import { OriginalTokenVault } from "../typechain/typechain/OriginalTokenVault";
import { OriginalTokenVault__factory } from "../typechain/typechain/factories/OriginalTokenVault__factory";
import { OriginalTokenVaultV2 } from "../typechain/typechain/OriginalTokenVaultV2";
import { OriginalTokenVaultV2__factory } from "../typechain/typechain/factories/OriginalTokenVaultV2__factory";
import { RFQ } from "../typechain/typechain/RFQ";
import { RFQ__factory } from "../typechain/typechain/factories/RFQ__factory";
import { TransferAgent } from "../typechain/typechain/TransferAgent";
import { TransferAgent__factory } from "../typechain/typechain/factories/TransferAgent__factory";

export type BridgeContracts = {
  bridge: Bridge | undefined;
  lpbridge: Bridge | undefined;
  dstbridge: Bridge | undefined;
  // deprecated
  pool: Pool | undefined;
  farmingRewards: FarmingRewards | undefined;
  incentiveEventsReward: IncentiveEventsReward | undefined;
  faucet: Faucet | undefined;
  originalTokenVault: OriginalTokenVault | undefined;
  originalTokenVaultV2: OriginalTokenVaultV2 | undefined;
  peggedTokenBridge: PeggedTokenBridge | undefined;
  peggedTokenBridgeV2: PeggedTokenBridgeV2 | undefined;
  rfqContract: RFQ | undefined;
  transferAgent: TransferAgent | undefined;
};

export type BridgeContractFactoryClasses = {
  [key: string]: { new (signer: Signer): ContractFactory };
};

export const bridgeContractFactories: BridgeContractFactoryClasses = {
  bridge: Bridge__factory,
  lpbridge: Bridge__factory,
  dstbridge: Bridge__factory,
  pool: Pool__factory,
  farmingRewards: FarmingRewards__factory,
  incentiveEventsReward: IncentiveEventsReward__factory,
  faucet: Faucet__factory,
  originalTokenVault: OriginalTokenVault__factory,
  originalTokenVaultV2: OriginalTokenVaultV2__factory,
  peggedTokenBridge: PeggedTokenBridge__factory,
  peggedTokenBridgeV2: PeggedTokenBridgeV2__factory,
  rfqContract: RFQ__factory,
  transferAgent: TransferAgent__factory,
};

export const bridgeContracts: BridgeContracts = {
  bridge: undefined,
  lpbridge: undefined,
  dstbridge: undefined,
  // deprecated
  pool: undefined,
  farmingRewards: undefined,
  incentiveEventsReward: undefined,
  faucet: undefined,
  originalTokenVault: undefined,
  originalTokenVaultV2: undefined,
  peggedTokenBridge: undefined,
  peggedTokenBridgeV2: undefined,
  rfqContract: undefined,
  transferAgent: undefined,
};

function loadContract(
  keyName: string,
  signer: Signer,
  addresses: Record<string, string | undefined>,
): Contract | undefined {
  const address = addresses[keyName];
  if (!(keyName in addresses) || address === undefined || address.length <= 0) {
    return undefined;
  }
  const newContract = new bridgeContractFactories[keyName](signer).attach(addresses[keyName] as string);
  return newContract;
}

/**
 * Converts a Signer or Provider to a Signer.
 *
 * @param signerOrProvider A Signer or a Provider.
 * @returns A Signer.
 */
export async function ensureSigner(signerOrProvider: Signer | Provider): Promise<Signer | undefined> {
  let signer: Signer;
  let accounts: string[] = [];
  if (signerOrProvider && typeof (signerOrProvider as JsonRpcProvider).listAccounts === "function") {
    accounts = await (signerOrProvider as JsonRpcProvider).listAccounts();
  }

  if (accounts && accounts.length > 0) {
    signer = (signerOrProvider as JsonRpcProvider).getSigner();
  } else if (signerOrProvider instanceof InfuraProvider) {
    return undefined;
  } else {
    signer = signerOrProvider as Signer;
  }
  return signer;
}

/**
 * Loads pre-defined Bridge contracts.
 *
 * @param signerOrProvider A Signer or a Provider.
 * @param addresses The contract address.
 * @returns The contracts.
 */
export default function useContractLoader(
  signerOrProvider: Signer | Provider | undefined,
  addresses: Record<string, string | undefined>,
): BridgeContracts {
  const [contracts, setContracts] = useState<BridgeContracts>(bridgeContracts);
  useEffect(() => {
    async function loadContracts() {
      if (typeof signerOrProvider !== "undefined") {
        try {
          const signer = await ensureSigner(signerOrProvider);
          if (!signer) {
            return;
          }
          const newContracts = Object.keys(bridgeContracts).reduce((accumulator, keyName) => {
            accumulator[keyName] = loadContract(keyName, signer, addresses);
            return accumulator;
          }, {}) as BridgeContracts;
          setContracts(newContracts);
        } catch (e) {
          // console.log("Error loading contracts", e);
        }
      }
    }
    loadContracts();
  }, [signerOrProvider, addresses]);
  return contracts;
}
