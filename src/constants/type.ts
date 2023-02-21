/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */

import { BigNumber } from "ethers";
import { MapLike } from "typescript";
import {
  SwapStatus,
  Token,
  TokenAmount,
  SwapType,
} from "../proto/chainhop/common_pb";
import { BridgeType, TransferInfo } from "../proto/gateway/gateway_pb";

interface PeggedPairConfig {
  org_chain_id: number;
  org_token: Token.AsObject;
  pegged_chain_id: number;
  pegged_token: Token.AsObject;
  pegged_deposit_contract_addr: string;
  pegged_burn_contract_addr: string;
  canonical_token_contract_addr: string;
}

interface HopHistory {
  swapId: string;
  amountIn?: TokenAmount.AsObject;
  amountOut?: TokenAmount.AsObject;
  createTs: number;
  srcBlockTxLink: string;
  dstBlockTxLink: string;
  swapStatus: SwapStatus;
  cbrTransferId: string;
  refundedMidTokenOnDst?: Token.AsObject;
  refundedTokenAmtOnDst: string;
  bridgeType: string;

  status?: TransferHistoryStatus;
  updateTime?: number;
  txIsFailed?: boolean;
  transferHistory?: TransferHistory;
  isLocal?: boolean;
  swapType: SwapType;
}

export enum TransferHistoryStatus {
  TRANSFER_UNKNOWN,
  TRANSFER_SUBMITTING, // user: after calling mark transfer api
  TRANSFER_FAILED, // user: check if tx reverted when shown status is TRANSFER_SUBMITTING
  TRANSFER_WAITING_FOR_SGN_CONFIRMATION, // relayer: on send tx success event
  TRANSFER_WAITING_FOR_FUND_RELEASE, // relayer: mark send tx
  TRANSFER_COMPLETED, // relayer: on relay tx success event
  TRANSFER_TO_BE_REFUNDED, // x: transfer rejected by sgn and waiting for withdraw api called
  TRANSFER_REQUESTING_REFUND, // user: withdraw api has been called and withdraw is processing by sgn
  TRANSFER_REFUND_TO_BE_CONFIRMED, // x: withdraw is approved by sgn
  TRANSFER_CONFIRMING_YOUR_REFUND, // user: mark refund has been submitted on chain
  TRANSFER_REFUNDED, // relayer: on refund(withdraw liquidity actually) tx event
  TRANSFER_DELAYED,

  SS_PENDING,
  SS_SRC_FAILED,
  SS_DST_COMPLETED,
  SS_DST_REFUNDED,
  SS_SRC_REFUNDED,
}

export enum TransferRefundParamStatus {
  // TRANSFER_TYPE_NULL indicates no transfer association.
  TRANSFER_TYPE_NULL = 0,
  // TRANSFER_TYPE_LIQUIDITY_SEND defines a send transfer via a liquidity bridge.
  TRANSFER_TYPE_LIQUIDITY_SEND = 1,
  // TRANSFER_TYPE_LIQUIDITY_WITHDRAW defines a withdraw transfer from a liquidity bridge.
  TRANSFER_TYPE_LIQUIDITY_WITHDRAW = 2,
  // TRANSFER_TYPE_PEG_MINT defines a mint transfer via a pegged token bridge.
  TRANSFER_TYPE_PEG_MINT = 3,
  // TRANSFER_TYPE_PEG_MINT defines a withdraw transfer from an original token vault.
  TRANSFER_TYPE_PEG_WITHDRAW = 4,
  // TRANSFER_TYPE_PEG_MINT_V2 defines a mint transfer via a pegged token bridge v2.
  TRANSFER_TYPE_PEG_MINT_V2 = 5,
  // TRANSFER_TYPE_PEG_MINT_V2 defines a withdraw transfer from an original token vault v2.
  TRANSFER_TYPE_PEG_WITHDRAW_V2 = 6,
}

interface GetTransferInfoRequest {
  transfer_id: string;
}

interface GetTransferInfoResponse {
  transfer: TransferHistory;
}

interface TransferHistory {
  transfer_id: string;
  src_send_info: TransferInfo.AsObject;
  dst_received_info: TransferInfo.AsObject;
  ts: number;
  src_block_tx_link: string;
  dst_block_tx_link: string;
  status: TransferHistoryStatus;
  refund_reason: number;

  updateTime?: number;
  txIsFailed?: boolean;
}

interface GetTransferStatusRequest {
  transfer_id: string;
}

interface GetTransferStatusResponse {
  status: TransferHistoryStatus;
  wd_onchain: string;
  sorted_sigs: Array<string>;
  signers: Array<string>;
  powers: Array<string>;
  src_block_tx_link?: string;
  dst_block_tx_link?: string;
  src_send_info?: TransferInfo;
  dst_received_info?: TransferInfo;
  bridge_type?: BridgeType;
}

interface WithdrawDetail {
  _wdmsg: string;
  _sigs: Array<string>;
  _signers: Array<string>;
  _powers: Array<string>;
}

interface TokenUrlPair {
  key: string;
  url: string;
}

interface ConfigToken {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

interface TokenListMap {
  key: string;
  tokenList: ConfigToken[];
}

interface DestinationChainTransferInfo {
  delayPeriod: BigNumber;
  delayThresholds: BigNumber;
  epochVolumeCaps: BigNumber;
}

interface SourceChainTransferInfo {
  minAmount: BigNumber;
  maxAmount: BigNumber;
}

export enum BridgeTypeForBridgeConfig {
  Null,
  LiquidityPool,
  PegDeposit,
  PegBurn,
  PegV2Deposit,
  PegV2Burn,
  PegBurnMint, // Token will be burned on Peg Chain A and be minted on Peg Chain B
}

interface TransferPair {
  sourceChainInfo: Chain | undefined;
  sourceChainToken: TokenInfoFromBridgeConfig | undefined;
  sourceChainContractAddress: string | undefined;
  sourceChainCanonicalTokenAddress: string | undefined;
  sourceChainContractVersion: number;
  bridgeType: BridgeTypeForBridgeConfig;
  destinationChainInfo: Chain | undefined;
  destinationToken: TokenInfoFromBridgeConfig | undefined;
  destinationChainContractAddress: string | undefined;
  destinationCanonicalTokenAddress: string | undefined;
  destinationChainContractVersion: number;
}

interface Chain {
  id: number;
  name: string;
  icon: string;
  block_delay: number;
  gas_token_symbol: string;
  explore_url: string;
  rpc_url: string;
  contract_addr: string;
  drop_gas_amt?: string;
}

interface TokenInfoFromBridgeConfig {
  token: Token.AsObject;
  name: string;
  icon: string;
  max_amt: string;
  balance?: string;
  inbound_lmt?: string;
}

interface PeggedPairConfigFromBridgeConfig {
  org_chain_id: number;
  org_token: TokenInfoFromBridgeConfig;
  pegged_chain_id: number;
  pegged_token: TokenInfoFromBridgeConfig;
  pegged_deposit_contract_addr: string;
  pegged_burn_contract_addr: string;
  canonical_token_contract_addr: string;
  vault_version: number;
  bridge_version: number;
}

// interface Token {
//   symbol: string;
//   address: string;
//   decimal: number;
//   xfer_disabled: boolean;
//   display_symbol?: string; /// FOR ETH <=====> WETH
// }

interface ChainTokenInfo {
  token: Array<TokenInfoFromBridgeConfig>;
}
interface ChainHopTokenInfo {
  tokenList: Array<Token.AsObject>;
}

interface GetTransferConfigsResponse {
  chains: Array<Chain>;
  chain_token: MapLike<ChainTokenInfo>;
  farming_reward_contract_addr: string;
  pegged_pair_configs: Array<PeggedPairConfigFromBridgeConfig>;
}

interface FlowDepositParameters {
  safeBoxContractAddress: string;
  storagePath: string;
  amount: string;
  flowAddress: string; /// Flow wallet address
  mintChainId: string;
  evmMintAddress: string; /// EVM wallet address
  nonce: string;
  tokenAddress: string;
}

interface FlowDepositResponse {
  flowTransanctionId: string; // flow transaction hash
  transferId: string; // auto generated transfer id
}

interface FlowBurnParameters {
  pegBridgeAddress: string;
  storagePath: string;
  amount: string;
  flowAddress: string; /// Flow wallet address
  withdrawChainId: string;
  evmWithdrawAddress: string; /// EVM wallet address
  nonce: string;
  tokenAddress: string;
}

interface FlowBurnResponse {
  flowTransanctionId: string; // flow transaction hash
  transferId: string; // auto generated transfer id
}

interface FlowDepositTokenConfig {
  minDepo: number;
  maxDepo: number;
  cap: number;
  delayThreshold: number;
}

interface FlowBurnTokenConfig {
  minBurn: number;
  maxBurn: number;
  cap: number;
  delayThreshold: number;
}

interface FlowTokenPathConfigs {
  FtConfigs: Array<FlowTokenPathConfig>;
}
interface FlowTokenPathConfig {
  TokenName: string;
  FullAddress: string;
  TokenAddress: string;
  StoragePath: string;
  BalancePath: string;
  ReceiverPath: string;
  Symbol: string;
}

interface TokenBalance {
  isNativeToken: boolean,
  balance: BigNumber,
  sysmbol: string,
  decimals: number
}

interface CoMinterCap {
  minterSupply: BigNumber;
}
// interface TokenInfo {
//   decimal?: number;
//   name?: string;
//   symbol?: string;
//   icon?: string;
//   address?: string;
// }
export type {
  GetTransferStatusRequest,
  GetTransferStatusResponse,
  GetTransferInfoRequest,
  GetTransferInfoResponse,
  TransferHistory,
  WithdrawDetail,
  PeggedPairConfig,
  HopHistory,
  TokenUrlPair,
  TokenListMap,
  ConfigToken,
  TransferPair,
  Chain,
  TokenInfoFromBridgeConfig,
  GetTransferConfigsResponse,
  SourceChainTransferInfo,
  DestinationChainTransferInfo,
  CoMinterCap,
  FlowDepositParameters,
  FlowDepositResponse,
  FlowBurnParameters,
  FlowBurnResponse,
  FlowDepositTokenConfig,
  FlowBurnTokenConfig,
  FlowTokenPathConfigs,
  FlowTokenPathConfig,
  ChainHopTokenInfo,
  TokenBalance
};

export const COMMONTOKEN_BASES = {
  5: [
    { symbol: "USDT", address: "0xf4B2cbc3bA04c478F0dC824f4806aC39982Dce73" },
    { symbol: "USDC", address: "0xcbe56b00d173a26a5978ce90db2e33622fd95a28" },
    { symbol: "DAI", address: "0x830eB9358C40c591C9591BAd52F73f76a32ca53b" },
  ],
  69: [
    { symbol: "USDT", address: "0x6a2d262d56735dba19dd70682b39f6be9a931d98" },
  ],
  4002: [
    { symbol: "USDT", address: "0x7d43aabc515c356145049227cee54b608342c0ad" },
    { symbol: "WETH", address: "0x2444486c0eee140105c0fb9b6b55513089689d62" },
  ],
  97: [
    { symbol: "USDT", address: "0x7d43AABC515C356145049227CeE54B608342c0ad" },
    { symbol: "DAI", address: "0xF82bbA32bcbbdFa1365ae13dc3Ad6cC5F0BEeF5C" },
  ],
  1: [
    { symbol: "WETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
    { symbol: "USDC", address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" },
    { symbol: "USDT", address: "0xdac17f958d2ee523a2206206994597c13d831ec7" },
    { symbol: "DAI", address: "0x6b175474e89094c44da98b954eedeac495271d0f" },
    { symbol: "WBTC", address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599" },
  ],
  56: [
    { symbol: "WBNB", address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" },
    { symbol: "ETH", address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8" },
    { symbol: "USDT", address: "0x55d398326f99059fF775485246999027B3197955" },
    { symbol: "USDC", address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d" },
    { symbol: "BUSD", address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56" },
    { symbol: "BTCB", address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c" },
  ],
  137: [
    { symbol: "WMATIC", address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270" },
    { symbol: "ETH", address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619" },
    { symbol: "USDT", address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F" },
    { symbol: "USDC", address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" },
    { symbol: "DAI", address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063" },
    { symbol: "WBTC", address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6" },
  ],
  250: [
    { symbol: "wFTM", address: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83" },
    { symbol: "ETH", address: "0x74b23882a30290451A17c44f4F05243b6b58C76d" },
    { symbol: "fUSDT", address: "0x049d68029688eAbF473097a2fC38ef61633A3C7A" },
    { symbol: "USDC", address: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75" },
    { symbol: "DAI", address: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E" },
    { symbol: "BTC", address: "0x321162Cd933E2Be498Cd2267a90534A804051b11" },
  ],
  43114: [
    // { symbol: "WAVAX", address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7" },
    { symbol: "WETH.e", address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB" },
    { symbol: "USDT.e", address: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118" },
    { symbol: "USDC.e", address: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664" },
    { symbol: "DAI.e", address: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70" },
    { symbol: "WBTC.e", address: "0x50b7545627a5162F82A992c33b87aDc75187B218" },
  ],
  42161: [
    { symbol: "WETH", address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" },
    { symbol: "USDT", address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" },
    { symbol: "USDC", address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8" },
    { symbol: "DAI", address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1" },
    { symbol: "WBTC", address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f" },
  ],
  10: [
    { symbol: "WETH", address: "0x4200000000000000000000000000000000000006" },
    { symbol: "USDT", address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58" },
    { symbol: "USDC", address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607" },
    { symbol: "DAI", address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1" },
    { symbol: "WBTC", address: "0x68f180fcCe6836688e9084f035309E29Bf0A2095" },
  ],
};
// export const COMMONTOKEN_BASES = {
//   1: [getNetworkById(1).symbol, "USDT", "USDC", "DAI", "WETH", "WBTC"],
//   5: [getNetworkById(5).symbol, "USDT", "USDC", "DAI", "WETH", "WBTC"],
//   97: [getNetworkById(5).symbol, "USDT", "USDC", "DAI", "WETH", "WBTC"],
//   56: [getNetworkById(56).symbol, "USDT", "USDC", "DAI", "WETH", "WBTC"],
//   137: [getNetworkById(137).symbol, "USDT", "USDC", "DAI", "WETH", "WBTC"],
//   250: [getNetworkById(250).symbol, "USDT", "USDC", "DAI", "WETH", "WBTC"],
//   42161: [getNetworkById(42161).symbol, "USDT", "USDC", "DAI", "WETH", "WBTC"],
//   43114: [getNetworkById(42161).symbol, "USDT", "USDC", "DAI", "WETH", "WBTC"],
// };
