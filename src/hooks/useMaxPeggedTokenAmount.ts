import { useMemo } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
import { safeParseUnits } from "celer-web-utils/lib/format";
import { ERC20, ERC20__factory, MultiBridgeToken, MultiBridgeToken__factory } from "../typechain/typechain";
import { getNonEVMMode, NonEVMMode } from "../providers/NonEVMContextProvider";
import { validateTransferPair } from "../helpers/transferPairValidation";
import { TransferPair, BridgeType } from "../constants/type";
import { getNetworkById } from "../constants/network";
import { GetTokenBoundRequest } from "../proto/gateway/gateway_pb";
import { getTokenBound } from "../redux/gateway";
import { readOnlyContract } from "./customReadyOnlyContractLoader";
import { UpgradeableERC20__factory } from "../typechain/typechain/conflux/UpgradeableERC20__factory";
import { UpgradeableERC20 } from "../typechain/typechain/conflux/UpgradeableERC20";
import { BridgedERC20__factory } from "../typechain/typechain/REI/BridgedERC20__factory";
import { BridgedERC20 } from "../typechain/typechain/REI/BridgedERC20";
import { getAptosBurnTotalSupply } from "../redux/NonEVMAPIs/aptosAPIs";
import { getFlowBurnTotalSupply } from "../redux/NonEVMAPIs/flowAPIs";
import { getSeiBurnTotalSupply } from "../redux/NonEVMAPIs/seiAPI";
import { getInjBurnTotalSupply } from "../redux/NonEVMAPIs/injectiveAPI";

export function useBurnTotalSupply(transferPair: TransferPair): {
  burnTotalSupplyCallback: null | (() => Promise<BigNumber | undefined>);
} {
  return useMemo(() => {
    switch (transferPair.bridgeType) {
      case BridgeType.PegBurn:
      case BridgeType.PegV2Burn:
      case BridgeType.PegBurnMint: {
        break;
      }
      default: {
        return { burnTotalSupplyCallback: null };
      }
    }

    const sourceChainNonEVMMode = getNonEVMMode(transferPair.sourceChainInfo?.id ?? 0);

    switch (sourceChainNonEVMMode) {
      case NonEVMMode.aptosMainnet:
      case NonEVMMode.aptosTest:
      case NonEVMMode.aptosDevnet: {
        return {
          burnTotalSupplyCallback: async function onBurnSwapTotalSupplyFound(): Promise<BigNumber | undefined> {
            const totalSupply = await getAptosBurnTotalSupply(
              transferPair.sourceChainContractAddress ?? "",
              transferPair.sourceChainToken?.token.address ?? "",
            );
            return BigNumber.from(totalSupply);
          },
        };
      }
      case NonEVMMode.flowMainnet:
      case NonEVMMode.flowTest: {
        return {
          burnTotalSupplyCallback: async function onBurnSwapTotalSupplyFound(): Promise<BigNumber | undefined> {
            const totalSupply = await getFlowBurnTotalSupply(transferPair.sourceChainToken?.token.address ?? "");
            const delayThresholds = safeParseUnits(
              totalSupply.toString() || "0",
              transferPair.sourceChainToken?.token.decimal ?? 8,
            );
            return delayThresholds;
          },
        };
      }
      case NonEVMMode.seiDevnet:
      case NonEVMMode.seiMainnet:
      case NonEVMMode.seiTestnet: {
        return {
          burnTotalSupplyCallback: async function onBurnSwapTotalSupplyFound(): Promise<BigNumber | undefined> {
            const totalSupply = await getSeiBurnTotalSupply(
              transferPair.sourceChainContractAddress ?? "",
              transferPair.sourceChainToken?.token.address ?? "",
            );
            return BigNumber.from(totalSupply);
          },
        };
      }
      case NonEVMMode.injectiveTestnet:
      case NonEVMMode.injectiveMainnet: {
        return {
          burnTotalSupplyCallback: async function onBurnSwapTotalSupplyFound(): Promise<BigNumber | undefined> {
            const totalSupply = await getInjBurnTotalSupply(
              transferPair.sourceChainContractAddress ?? "",
              transferPair.sourceChainToken?.token.address ?? "",
            );
            return BigNumber.from(totalSupply);
          },
        };
      }
      default: {
        break;
      }
    }

    if (!validateTransferPair(transferPair)) {
      return { burnTotalSupplyCallback: null };
    }

    if (
      (transferPair.bridgeType === BridgeType.PegBurn || transferPair.bridgeType === BridgeType.PegV2Burn) &&
      (transferPair.sourceChainCanonicalTokenAddress?.length ?? 0) > 0
    ) {
      const sourceChainInfo = transferPair.sourceChainInfo;
      const sourceChainToken = transferPair.sourceChainToken;
      const sourceChainContractAddress = transferPair.sourceChainContractAddress;

      if (!sourceChainInfo || !sourceChainToken || !sourceChainContractAddress) {
        return { burnTotalSupplyCallback: null };
      }

      return {
        burnTotalSupplyCallback: async function onBurnSwapTotalSupplyFound(): Promise<BigNumber | undefined> {
          const provider = new JsonRpcProvider(getNetworkById(sourceChainInfo.id).rpcUrl);
          const tokenContract = (await readOnlyContract(provider, sourceChainToken.token.address, ERC20__factory)) as
            | ERC20
            | undefined;
          const maxAmount = await tokenContract?.totalSupply();
          return maxAmount;
        },
      };
    }

    if (
      transferPair.bridgeType === BridgeType.PegBurnMint &&
      transferPair.destinationChainMigrationPegBurnContractAddr
    ) {
      const sourceChainInfo = transferPair.sourceChainInfo;
      const sourceChainToken = transferPair.sourceChainToken;
      const sourceChainContractAddress = transferPair.sourceChainContractAddress;

      if (!sourceChainInfo || !sourceChainToken || !sourceChainContractAddress) {
        return { burnTotalSupplyCallback: null };
      }

      if (sourceChainInfo.id === 58) {
        return {
          burnTotalSupplyCallback: async function onBurnSwapTotalSupplyFound(): Promise<BigNumber | undefined> {
            const provider = new JsonRpcProvider(getNetworkById(sourceChainInfo.id).rpcUrl);

            const tokenContract = (await readOnlyContract(
              provider,
              sourceChainToken.token.address,
              UpgradeableERC20__factory,
            )) as UpgradeableERC20;
            const maxAmount = await tokenContract?.totalSupply();
            return maxAmount;
          },
        };
      }

      if (sourceChainInfo.id === 1030) {
        return {
          burnTotalSupplyCallback: async function onBurnSwapTotalSupplyFound(): Promise<BigNumber | undefined> {
            const provider = new JsonRpcProvider(getNetworkById(sourceChainInfo.id).rpcUrl);

            const tokenContract = (await readOnlyContract(
              provider,
              sourceChainToken.token.address,
              UpgradeableERC20__factory,
            )) as UpgradeableERC20;
            const maxAmount = await tokenContract?.minterSupply(sourceChainContractAddress);
            return maxAmount?.total;
          },
        };
      }

      if (sourceChainInfo.id === 47805) {
        return {
          burnTotalSupplyCallback: async function onBurnSwapTotalSupplyFound(): Promise<BigNumber | undefined> {
            const provider = new JsonRpcProvider(getNetworkById(sourceChainInfo.id).rpcUrl);

            const tokenContract = (await readOnlyContract(
              provider,
              sourceChainToken.token.address,
              BridgedERC20__factory,
            )) as BridgedERC20;
            const maxAmount = await tokenContract?.minterSupply(sourceChainContractAddress);
            return maxAmount?.total;
          },
        };
      }

      return {
        burnTotalSupplyCallback: async function onBurnSwapTotalSupplyFound(): Promise<BigNumber | undefined> {
          const provider = new JsonRpcProvider(getNetworkById(sourceChainInfo.id).rpcUrl);
          const tokenContract = (await readOnlyContract(
            provider,
            sourceChainToken.token.address,
            MultiBridgeToken__factory,
          )) as MultiBridgeToken | undefined;
          const maxAmount = await tokenContract?.bridges(sourceChainContractAddress);
          return maxAmount?.total;
        },
      };
    }

    return { burnTotalSupplyCallback: null };
  }, [transferPair]);
}

export function useInBoundTokenLimit(transferPair: TransferPair): {
  inBoundTokenLimitCallback: null | (() => Promise<BigNumber>);
} {
  return useMemo(() => {
    if (!validateTransferPair(transferPair)) {
      return { inBoundTokenLimitCallback: null };
    }

    const sourceChainInfo = transferPair.sourceChainInfo;
    const sourceChainToken = transferPair.sourceChainToken;
    const sourceChainContractAddress = transferPair.sourceChainContractAddress;

    if (!sourceChainInfo || !sourceChainToken || !sourceChainContractAddress) {
      return { inBoundTokenLimitCallback: null };
    }

    if ((sourceChainToken.inbound_lmt?.length ?? 0) === 0) {
      return { inBoundTokenLimitCallback: null };
    }

    return {
      inBoundTokenLimitCallback: async function onInBoundLimitFound(): Promise<BigNumber> {
        const getTokenBoundRequest = new GetTokenBoundRequest();
        getTokenBoundRequest.setChainId(sourceChainInfo.id);
        getTokenBoundRequest.setTokenAddr(sourceChainToken.token.address);
        const response = await getTokenBound(getTokenBoundRequest);
        let value = BigNumber.from(0);
        try {
          value = BigNumber.from(response.getValue());
        } catch {
          ///
        }
        return value;
      },
    };
  }, [transferPair]);
}
