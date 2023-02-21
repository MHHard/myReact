import { ethers } from "ethers";
import { createContext, ReactChild, ReactChildren, useContext } from "react";
import {
  BridgeTypeForBridgeConfig,
  Chain,
  GetTransferConfigsResponse,
  TransferPair,
} from "../constants/type";

/* eslint-disable*/

interface BridgeChainTokensContextProps {
  getTransferPair: ( 
    transferConfig: GetTransferConfigsResponse,
    sourceChainId: number,
    destinationChainId: number,
    sourceChainTokenAddress: string,
    destinationChainTokenAddress: string) => TransferPair;
  getTransferSnapshot: (transferPair: TransferPair) => string;
}

interface BridgeChainTokensProviderProps {
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export const nullTransferPair: TransferPair = {
  sourceChainInfo: undefined,
  sourceChainToken: undefined,
  sourceChainContractAddress: undefined,
  sourceChainCanonicalTokenAddress: undefined,
  sourceChainContractVersion: 0,
  bridgeType: BridgeTypeForBridgeConfig.Null,
  destinationChainInfo: undefined,
  destinationToken: undefined,
  destinationChainContractAddress: undefined,
  destinationCanonicalTokenAddress: undefined,
  destinationChainContractVersion: 0
};

export const BridgeChainTokensContext = createContext<BridgeChainTokensContextProps>({
  getTransferPair: () => {
    return nullTransferPair;
  },
  getTransferSnapshot: () => {
    return "";
  },
});

export const BridgeChainTokensProvider = ({ children }: BridgeChainTokensProviderProps): JSX.Element => {
  const getTransferPair = (
    transferConfig: GetTransferConfigsResponse,
    sourceChainId: number,
    destinationChainId: number,
    sourceChainTokenAddress: string,
    destinationChainTokenAddress: string
  ) => {
    if (sourceChainId === destinationChainId || 
        sourceChainTokenAddress.length === 0 ||
        destinationChainTokenAddress.length === 0 || 
        !transferConfig) {
      return nullTransferPair;
    }

    const sourceChainInfo = transferConfig.chains.find(chainInfo => {
      return chainInfo.id === sourceChainId;
    });
    const destinationChainInfo = transferConfig.chains.find(chainInfo => {
      return chainInfo.id === destinationChainId;
    });

    if (
      sourceChainInfo &&
      destinationChainInfo
    ) {
      const pair = generatePair(sourceChainInfo, sourceChainTokenAddress, destinationChainInfo, destinationChainTokenAddress, transferConfig);
      return pair;
    }

    return nullTransferPair;
  };

  const generatePair = (
    sourceChainInfo: Chain,
    sourceChainTokenAddress: string,
    destinationChainInfo: Chain,
    destinationChainTokenAddress: string,
    transferConfig: GetTransferConfigsResponse,
  ) => {
    let pair: TransferPair = nullTransferPair;

    /// Find deposit peg config
    const pegDepositConfig = transferConfig.pegged_pair_configs.find(peggedPairConfig => {
      return (
        peggedPairConfig.org_chain_id === sourceChainInfo.id &&
        peggedPairConfig.pegged_chain_id === destinationChainInfo.id &&
        peggedPairConfig.org_token.token.address === sourceChainTokenAddress &&
        peggedPairConfig.pegged_token.token.address === destinationChainTokenAddress
      );
    });

    if (pegDepositConfig) {
      pair = {
        sourceChainInfo: sourceChainInfo,
        sourceChainToken: pegDepositConfig.org_token,
        sourceChainContractAddress: pegDepositConfig.pegged_deposit_contract_addr,
        sourceChainCanonicalTokenAddress: pegDepositConfig.canonical_token_contract_addr,
        sourceChainContractVersion: pegDepositConfig.vault_version,
        bridgeType: pegDepositConfig.vault_version > 0 ? BridgeTypeForBridgeConfig.PegV2Deposit : BridgeTypeForBridgeConfig.PegDeposit,
        destinationChainInfo: destinationChainInfo,
        destinationToken: pegDepositConfig.pegged_token,
        destinationChainContractAddress: pegDepositConfig.pegged_burn_contract_addr,
        destinationCanonicalTokenAddress: pegDepositConfig.canonical_token_contract_addr,
        destinationChainContractVersion: pegDepositConfig.bridge_version
      };
      return pair;
    }

    /// Find burn peg config
    const pegBurnConfig = transferConfig.pegged_pair_configs.find(peggedPairConfig => {
      return (
        peggedPairConfig.pegged_chain_id === sourceChainInfo.id &&
        peggedPairConfig.org_chain_id === destinationChainInfo.id &&
        peggedPairConfig.pegged_token.token.address === sourceChainTokenAddress &&
        peggedPairConfig.org_token.token.address === destinationChainTokenAddress
      );
    });

    if (pegBurnConfig) {
      pair = {
        sourceChainInfo: sourceChainInfo,
        sourceChainToken: pegBurnConfig.pegged_token,
        sourceChainContractAddress: pegBurnConfig.pegged_burn_contract_addr,
        sourceChainCanonicalTokenAddress: pegBurnConfig.canonical_token_contract_addr,
        sourceChainContractVersion: pegBurnConfig.bridge_version,
        bridgeType: pegBurnConfig.bridge_version > 0 ? BridgeTypeForBridgeConfig.PegV2Burn : BridgeTypeForBridgeConfig.PegBurn,
        destinationChainInfo: destinationChainInfo,
        destinationToken: pegBurnConfig.org_token,
        destinationChainContractAddress: pegBurnConfig.pegged_deposit_contract_addr,
        destinationCanonicalTokenAddress: pegBurnConfig.canonical_token_contract_addr,
        destinationChainContractVersion: pegBurnConfig.vault_version
      };
      return pair;
    }

    const sourceChainIsPeggedChainPairs = transferConfig.pegged_pair_configs.filter(peggedPairConfig => {
      return (
        peggedPairConfig.pegged_chain_id === sourceChainInfo.id &&
        peggedPairConfig.pegged_token.token.address === sourceChainTokenAddress &&
        peggedPairConfig.bridge_version === 2
      );
    });

    const burnMintConfigs: TransferPair[] = [];

    sourceChainIsPeggedChainPairs.forEach(peggedPairConfig => {
      const destinationChainSharesTheSameOrgChainWithSourceChain = transferConfig.pegged_pair_configs.find(
        targetPairConfig => {
          return (
            peggedPairConfig.org_chain_id === targetPairConfig.org_chain_id &&
            peggedPairConfig.org_token.token.symbol === targetPairConfig.org_token.token.symbol &&
            targetPairConfig.pegged_chain_id === destinationChainInfo.id &&
            targetPairConfig.pegged_token.token.address === destinationChainTokenAddress &&
            targetPairConfig.bridge_version === 2
          );
        },
      );

      if (destinationChainSharesTheSameOrgChainWithSourceChain) {
        burnMintConfigs.push({
          sourceChainInfo: sourceChainInfo,
          sourceChainToken: peggedPairConfig.pegged_token,
          sourceChainContractAddress: peggedPairConfig.pegged_burn_contract_addr,
          sourceChainCanonicalTokenAddress: peggedPairConfig.canonical_token_contract_addr,
          sourceChainContractVersion: peggedPairConfig.bridge_version,
          bridgeType: BridgeTypeForBridgeConfig.PegBurnMint,
          destinationChainInfo: destinationChainInfo,
          destinationToken: destinationChainSharesTheSameOrgChainWithSourceChain.pegged_token,
          destinationChainContractAddress:
            destinationChainSharesTheSameOrgChainWithSourceChain.pegged_burn_contract_addr,
          destinationCanonicalTokenAddress:
            destinationChainSharesTheSameOrgChainWithSourceChain.canonical_token_contract_addr,
          destinationChainContractVersion:
            destinationChainSharesTheSameOrgChainWithSourceChain.bridge_version
        });
      }
    });

    if (burnMintConfigs.length > 0) {
      return burnMintConfigs[0];
    }

    const sourceChainToken = transferConfig.chain_token[sourceChainInfo.id]?.token.find(tokenInfo => {
      return tokenInfo.token.address.toLowerCase() === sourceChainTokenAddress.toLowerCase()
    })

    const destinationChainToken = transferConfig.chain_token[destinationChainInfo.id]?.token.find(tokenInfo => {
      return tokenInfo.token.address.toLowerCase() === destinationChainTokenAddress.toLowerCase()
    })

    if (sourceChainToken && destinationChainToken && sourceChainToken.token.symbol === destinationChainToken.token.symbol) {
      pair = {
        sourceChainInfo: sourceChainInfo,
        sourceChainToken: sourceChainToken,
        sourceChainContractAddress: sourceChainInfo.contract_addr,
        sourceChainCanonicalTokenAddress: "",
        sourceChainContractVersion: 0,
        bridgeType: BridgeTypeForBridgeConfig.LiquidityPool,
        destinationChainInfo: destinationChainInfo,
        destinationToken: destinationChainToken,
        destinationChainContractAddress: destinationChainInfo.contract_addr,
        destinationCanonicalTokenAddress: "",
        destinationChainContractVersion: 0
      };
    }

    return pair;
  };


  // get hash of the uniq string
  const getTransferSnapshot = (transferPair: TransferPair) => {
    const str = `${transferPair.sourceChainInfo?.id}-${transferPair.sourceChainToken?.token.address}-${transferPair.destinationChainInfo?.id}-${transferPair.destinationToken?.token.address}`;
    return ethers.utils.id(str);
  };

  return (
    <BridgeChainTokensContext.Provider
      value={{
        getTransferPair,
        getTransferSnapshot,
      }}
    >
      {children}
    </BridgeChainTokensContext.Provider>
  );
};

export const useBridgeChainTokensContext: () => BridgeChainTokensContextProps = () =>
  useContext(BridgeChainTokensContext);
