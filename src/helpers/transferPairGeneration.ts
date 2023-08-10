import { BridgeType, Chain, GetTransferConfigsResponse, TransferPair } from "../constants/type";

export const nullTransferPair: TransferPair = {
  sourceChainInfo: undefined,
  sourceChainToken: undefined,
  sourceChainContractAddress: undefined,
  sourceChainCanonicalTokenAddress: undefined,
  sourceChainContractVersion: 0,
  bridgeType: BridgeType.Null,
  destinationChainInfo: undefined,
  destinationToken: undefined,
  destinationChainContractAddress: undefined,
  destinationCanonicalTokenAddress: undefined,
  destinationChainContractVersion: 0,
  destinationChainMigrationPegBurnContractAddr: undefined,
};

const generatePairFunction = (
  sourceChainInfo: Chain,
  destinationChainInfo: Chain,
  tokenSymbol: string,
  transferConfig: GetTransferConfigsResponse,
  getNetworkById,
) => {
  let pair: TransferPair = nullTransferPair;

  /// Find deposit peg config
  const pegDepositConfig = transferConfig.pegged_pair_configs.find(peggedPairConfig => {
    return (
      peggedPairConfig.org_chain_id === sourceChainInfo.id &&
      peggedPairConfig.pegged_chain_id === destinationChainInfo.id &&
      peggedPairConfig.org_token.token.symbol === tokenSymbol &&
      peggedPairConfig.pegged_token.token.symbol === tokenSymbol
    );
  });

  if (pegDepositConfig) {
    pair = {
      sourceChainInfo,
      sourceChainToken: pegDepositConfig.org_token,
      sourceChainContractAddress: pegDepositConfig.pegged_deposit_contract_addr,
      sourceChainCanonicalTokenAddress: pegDepositConfig.canonical_token_contract_addr,
      sourceChainContractVersion: pegDepositConfig.vault_version,
      bridgeType: pegDepositConfig.vault_version > 0 ? BridgeType.PegV2Deposit : BridgeType.PegDeposit,
      destinationChainInfo,
      destinationToken: pegDepositConfig.pegged_token,
      destinationChainContractAddress: pegDepositConfig.pegged_burn_contract_addr,
      destinationCanonicalTokenAddress: pegDepositConfig.canonical_token_contract_addr,
      destinationChainContractVersion: pegDepositConfig.bridge_version,
      destinationChainMigrationPegBurnContractAddr: pegDepositConfig.migration_peg_burn_contract_addr,
    };
    return pair;
  }

  /// Find burn peg config
  const pegBurnConfig = transferConfig.pegged_pair_configs.find(peggedPairConfig => {
    return (
      peggedPairConfig.pegged_chain_id === sourceChainInfo.id &&
      peggedPairConfig.org_chain_id === destinationChainInfo.id &&
      peggedPairConfig.pegged_token.token.symbol === tokenSymbol &&
      peggedPairConfig.org_token.token.symbol === tokenSymbol
    );
  });

  if (pegBurnConfig) {
    pair = {
      sourceChainInfo,
      sourceChainToken: pegBurnConfig.pegged_token,
      sourceChainContractAddress: pegBurnConfig.pegged_burn_contract_addr,
      sourceChainCanonicalTokenAddress: pegBurnConfig.canonical_token_contract_addr,
      sourceChainContractVersion: pegBurnConfig.bridge_version,
      bridgeType: pegBurnConfig.bridge_version > 0 ? BridgeType.PegV2Burn : BridgeType.PegBurn,
      destinationChainInfo,
      destinationToken: pegBurnConfig.org_token,
      destinationChainContractAddress: pegBurnConfig.pegged_deposit_contract_addr,
      destinationCanonicalTokenAddress: pegBurnConfig.canonical_token_contract_addr,
      destinationChainContractVersion: pegBurnConfig.vault_version,
      destinationChainMigrationPegBurnContractAddr: pegBurnConfig.migration_peg_burn_contract_addr,
    };
    return pair;
  }

  const sourceChainIsPeggedChainPairs = transferConfig.pegged_pair_configs.filter(peggedPairConfig => {
    return (
      peggedPairConfig.pegged_chain_id === sourceChainInfo.id &&
      peggedPairConfig.pegged_token.token.symbol === tokenSymbol &&
      peggedPairConfig.bridge_version === 2 &&
      peggedPairConfig.org_token.token.symbol === tokenSymbol
    );
  });

  const burnMintConfigs: TransferPair[] = [];

  sourceChainIsPeggedChainPairs?.forEach(peggedPairConfig => {
    const destinationChainSharesTheSameOrgChainWithSourceChain = transferConfig.pegged_pair_configs.find(
      targetPairConfig => {
        return (
          peggedPairConfig.org_chain_id === targetPairConfig.org_chain_id &&
          peggedPairConfig.org_token.token.symbol === targetPairConfig.org_token.token.symbol &&
          targetPairConfig.pegged_chain_id === destinationChainInfo.id &&
          targetPairConfig.bridge_version === 2
        );
      },
    );

    if (destinationChainSharesTheSameOrgChainWithSourceChain) {
      burnMintConfigs.push({
        sourceChainInfo,
        sourceChainToken: peggedPairConfig.pegged_token,
        sourceChainContractAddress: peggedPairConfig.pegged_burn_contract_addr,
        sourceChainCanonicalTokenAddress: peggedPairConfig.canonical_token_contract_addr,
        sourceChainContractVersion: peggedPairConfig.bridge_version,
        bridgeType: BridgeType.PegBurnMint,
        destinationChainInfo,
        destinationToken: destinationChainSharesTheSameOrgChainWithSourceChain.pegged_token,
        destinationChainContractAddress: destinationChainSharesTheSameOrgChainWithSourceChain.pegged_burn_contract_addr,
        destinationCanonicalTokenAddress:
          destinationChainSharesTheSameOrgChainWithSourceChain.canonical_token_contract_addr,
        destinationChainContractVersion: destinationChainSharesTheSameOrgChainWithSourceChain.bridge_version,
        destinationChainMigrationPegBurnContractAddr:
          destinationChainSharesTheSameOrgChainWithSourceChain.migration_peg_burn_contract_addr,
      });
    }
  });

  if (burnMintConfigs.length > 0) {
    return burnMintConfigs[0];
  }

  const sourceChainPoolBasedTokenBlackList = getNetworkById(sourceChainInfo.id).lqMintTokenSymbolBlackList;
  const sourceChainPoolBasedToken = transferConfig.chain_token[sourceChainInfo.id].token.find(tokenInfo => {
    return (
      tokenInfo.token.symbol === tokenSymbol &&
      !tokenInfo.token.xfer_disabled &&
      !sourceChainPoolBasedTokenBlackList.includes(tokenSymbol)
    );
  });

  const destinationChainPoolBasedTokenBlackList = getNetworkById(destinationChainInfo.id).lqMintTokenSymbolBlackList;
  const destinationChainPoolBasedToken = transferConfig.chain_token[destinationChainInfo.id].token.find(tokenInfo => {
    return (
      tokenInfo.token.symbol === tokenSymbol &&
      !tokenInfo.token.xfer_disabled &&
      !destinationChainPoolBasedTokenBlackList.includes(tokenSymbol)
    );
  });

  if (sourceChainPoolBasedToken && destinationChainPoolBasedToken) {
    pair = {
      sourceChainInfo,
      sourceChainToken: sourceChainPoolBasedToken,
      sourceChainContractAddress: sourceChainInfo.contract_addr,
      sourceChainCanonicalTokenAddress: "",
      sourceChainContractVersion: 0,
      bridgeType: BridgeType.LiquidityPool,
      destinationChainInfo,
      destinationToken: destinationChainPoolBasedToken,
      destinationChainContractAddress: destinationChainInfo.contract_addr,
      destinationCanonicalTokenAddress: "",
      destinationChainContractVersion: 0,
      destinationChainMigrationPegBurnContractAddr: undefined,
    };

    return pair;
  }

  return pair;
};
export const getTransferPairFunction = (
  transferConfig: GetTransferConfigsResponse | undefined,
  sourceChainId: number,
  destinationChainId: number,
  tokenSymbol: string,
  getNetworkById,
) => {
  if (sourceChainId === destinationChainId || tokenSymbol.length === 0 || !transferConfig) {
    return nullTransferPair;
  }

  const tokenInSourceChainWhiteList = getNetworkById(sourceChainId).tokenSymbolList.includes(tokenSymbol);
  const tokenInDestinationChainWhiteList = getNetworkById(destinationChainId).tokenSymbolList.includes(tokenSymbol);
  const tokenInSourceChainTokenConfig = transferConfig.chain_token[sourceChainId]?.token.find(tokenInfo => {
    return tokenInfo.token.symbol === tokenSymbol;
  });
  const tokenInDestinationChainTokenConfig = transferConfig.chain_token[destinationChainId]?.token.find(tokenInfo => {
    return tokenInfo.token.symbol === tokenSymbol;
  });
  const sourceChainInfo = transferConfig.chains.find(chainInfo => {
    return chainInfo.id === sourceChainId;
  });
  const destinationChainInfo = transferConfig.chains.find(chainInfo => {
    return chainInfo.id === destinationChainId;
  });

  if (
    tokenInSourceChainWhiteList &&
    tokenInDestinationChainWhiteList &&
    tokenInSourceChainTokenConfig &&
    tokenInDestinationChainTokenConfig &&
    sourceChainInfo &&
    destinationChainInfo
  ) {
    const pair = generatePairFunction(
      sourceChainInfo,
      destinationChainInfo,
      tokenSymbol,
      transferConfig,
      getNetworkById,
    );
    return pair;
  }

  return nullTransferPair;
};
