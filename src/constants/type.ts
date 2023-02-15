/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */

// import { Bytes } from "ethers";
import { BigNumber } from "ethers";
import { MapLike } from "typescript";
import { BridgeType as gatewayBridgeType } from "../proto/gateway/gateway_pb";

interface ErrMsg {
  code: ErrCode;
  msg: string;
}

enum ErrCode {
  ERROR_CODE_UNDEFINED = 0,
  ERROR_CODE_COMMON = 500,
  ERROR_NO_TOKEN_ON_DST_CHAIN = 1001,
}

export enum LPHistoryStatus {
  LP_UNKNOWN,
  LP_WAITING_FOR_SGN,
  LP_WAITING_FOR_LP,
  LP_SUBMITTING,
  LP_COMPLETED,
  LP_FAILED,
  LP_DELAYED,
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
  farming_reward_contract_addr: string;
  transfer_agent_contract_addr?: string;
}

interface PeggedPairConfig {
  org_chain_id: number;
  org_token: TokenInfo;
  pegged_chain_id: number;
  pegged_token: TokenInfo;
  pegged_deposit_contract_addr: string;
  pegged_burn_contract_addr: string;
  canonical_token_contract_addr: string;
  vault_version: number;
  bridge_version: number;
  migration_peg_burn_contract_addr; // used to peg v0 to v2 transition, if this value is not null, stand for it's a v2 peg mode, burn the v0 supply first.
}

interface Token {
  symbol: string;
  address: string;
  decimal: number;
  xfer_disabled: boolean;
  display_symbol?: string; /// FOR ETH <=====> WETH
}

interface GetAdvancedInfoRequest {
  addr: string;
}

interface GetAdvancedInfoResponse {
  slippage_tolerance: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any;
}
interface SetAdvancedInfoRequest {
  addr: string;
  slippage_tolerance: number;
}

interface ChainTokenInfo {
  token: Array<TokenInfo>;
}

interface GetTransferConfigsResponse {
  chains: Array<Chain>;
  chain_token: MapLike<ChainTokenInfo>;
  pegged_pair_configs: Array<PeggedPairConfig>;
}

interface EstimateAmtRequest {
  src_chain_id: number;
  dst_chain_id: number;
  token_symbol: string;
  amt: string;
  usr_addr: string;
}

interface EstimateAmtResponse {
  eq_value_token_amt: string;
  bridge_rate: number;
  fee: string;
  slippage_tolerance: number;
  max_slippage: number;
  err: any;
}

interface MarkTransferRequest {
  transfer_id: string;
  // dst_transfer_id: string;
  src_send_info?: TransferInfo;
  dst_min_received_info?: TransferInfo;
  addr?: string;
  src_tx_hash?: string;
  type: MarkTransferTypeRequest;
  withdraw_seq_num?: string;
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
}

export enum MarkTransferTypeRequest {
  TRANSFER_TYPE_UNKNOWN = 0,
  TRANSFER_TYPE_SEND = 1,
  TRANSFER_TYPE_REFUND = 2,
}

interface GetLPInfoListRequest {
  addr: string;
}

interface GetLPInfoListResponse {
  lp_info: Array<LPInfo>;
}

interface LPInfo {
  key: string;
  chain: Chain;
  token: TokenInfo;
  liquidity: number;
  liquidity_amt: string;
  has_farming_sessions: boolean;
  lp_fee_earning: number;
  farming_reward_earning: number;
  volume_24h: number;
  total_liquidity: number;
  total_liquidity_amt: string;
  lp_fee_earning_apy: number;
  farming_apy: number;
  farming_session_tokens: TokenInfo[];
  isCanwidthdraw?: boolean;
  liquidityList?: LPInfo[];
  chainList?: Chain[];
  diableAggregateRemove?: boolean;
  disableAddLiquidity?: boolean;
  isWrapTokenLiquidity?: boolean;
}

type LPList = Array<LPInfo>;

interface WithdrawLiquidityRequest {
  transfer_id?: string;
  receiver_addr?: string;
  amount?: string;
  token_addr?: string;
  chain_id?: number;
  sig?: string;
  reqid?: number;
  // creator:string
}

interface WithdrawLiquidityResponse {
  seq_num: string;
  withdraw_id: string;
}
interface WithdrawDetail {
  _wdmsg: string;
  _sigs: Array<string>;
  _signers: Array<string>;
  _powers: Array<string>;
}

interface QueryLiquidityStatusResponse {
  status: LPHistoryStatus;
  wd_onchain: string;
  sorted_sigs: Array<string>;
  signers: Array<string>;
  powers: Array<string>;
  block_tx_link: string;
}

interface QueryLiquidityStatusRequest {
  seq_num?: string;
  tx_hash?: string;
  lp_addr: string;
  chain_id: number;
  type: LPType;
}

interface TransferHistoryRequest {
  next_page_token: string; // for first page, it's ""
  page_size: number;
  acct_addr: string[];
}

interface TransferHistory {
  transfer_id: string;
  src_send_info: TransferInfo;
  dst_received_info: TransferInfo;
  srcAddress: string;
  dstAddress: string;
  ts: number;
  src_block_tx_link: string;
  dst_block_tx_link: string;
  status: TransferHistoryStatus;
  updateTime?: number;
  txIsFailed?: boolean;
  nonce: number;
  isLocal?: boolean;
  update_ts?: number;
  bridge_type?: gatewayBridgeType;
  dst_deadline?: number;
  refund_reason?: number;
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
}

interface TransferInfo {
  chain: Chain;
  token: Token;
  amount: string;
}

interface TransferHistoryResponse {
  history: Array<TransferHistory>;
  next_page_token: string;
  current_size: number;
}

interface LPHistoryRequest {
  next_page_token: string; // for first page, it's ""
  page_size: number;
  addr: string;
}

interface LPHistory {
  chain: Chain;
  token: TokenInfo;
  amount: string;
  ts: number;
  block_tx_link: string;
  status: LPHistoryStatus;
  type: LPType;
  withdraw_id: string;
  seq_num: number;
  method_type: number;
  nonce: number;
  isLocal?: boolean;
  updateTime?: number;
  txIsFailed?: boolean;
}

export enum LPType {
  LP_TYPE_UNKNOWN = 0,
  LP_TYPE_ADD = 1,
  LP_TYPE_REMOVE = 2,
}

interface TokenInfo {
  token: Token;
  name: string;
  icon: string;
  max_amt?: string;
  balance?: string;
  inbound_lmt?: string;
  inbound_epoch_cap?: string;
  transfer_disabled?: boolean;
  liq_add_disabled?: boolean;
  liq_rm_disabled?: boolean;
  delay_threshold?: string;
  delay_period?: number;
  liq_agg_rm_src_disabled?: boolean;
}

interface MarkLiquidityRequest {
  lp_addr: string;
  amt: string;
  token_addr: string;
  chain_id: number;
  seq_num?: string;
  tx_hash?: string;
  type: LPType;
}

interface LPHistoryResponse {
  history: Array<LPHistory>;
  next_page_token: string;
  current_size: number;
}

interface ErrMsg {
  code: ErrCode;
  msg: string;
}

interface ClaimWithdrawRewardRequest {
  addr: string;
}

interface ClaimRewardDetailsRequest {
  addr: string;
}

interface Signature {
  signer: string;
  sig_bytes: string;
}

interface RewardClaimDetails {
  chain_id: string;
  reward_proto_bytes: string;
  signatures: Array<Signature>;
}

interface ClaimRewardDetailsResponse {
  details?: Array<RewardClaimDetails>;
}

interface RewardingDataRequest {
  addr: string;
}

interface Reward {
  amt: number;
  token: Token;
  chain_id: number;
}

interface RewardingDataResponse {
  err: ErrMsg;
  historical_cumulative_rewards: Array<Reward>;
  unlocked_cumulative_rewards: Array<Reward>;
  usd_price: MapLike<number>;
}

interface GetRetentionRewardsInfoRequest {
  addr: string;
}

interface GetRetentionRewardsInfoResponse {
  err?: ErrMsg;
  event_id: number;
  event_end_time: number;
  max_reward: string;
  max_transfer_volume: number;
  current_reward: string;
  celr_usd_price: number;
  claim_time: number;
  signature: Signature;
  event_promo_img_url: string;
  event_faq_link_url: string;
  event_rewards_tooltip: string;
  event_description: string;
  event_title: string;
  event_max_reward_cap: number;
  so_far_sum_reward: number;
}

interface ClaimRetentionRewardsRequest {
  addr: string;
}

interface ClaimRetentionRewardsResponse {
  err?: ErrMsg;
  event_id: number;
  current_reward: string;
  signature: Signature;
}

interface GetPercentageFeeRebateInfoRequest {
  addr: string;
}

interface GetPercentageFeeRebateInfoResponse {
  err?: ErrMsg;
  event_id: number;
  event_end_time: number;
  rebate_portion: number;
  reward: string;
  celr_usd_price: number;
  claim_time: number;
  signature: Signature;
  event_max_reward_cap: number;
  so_far_sum_reward: number;
  reward_amt: number;
  reward_token_symbol: string;
  per_user_max_reward_cap: number;
}

interface ClaimPercentageFeeRebateRequest {
  addr: string;
}

interface ClaimPercentageFeeRebateResponse {
  err?: ErrMsg;
  event_id: number;
  reward: string;
  signature: Signature;
}

export enum UnlockRewardType {
  SWITCH_CHAIN,
  UNLOCK,
  UNLOCKED_TOO_FREQUENTLY,
  UNLOCKING,
  UNLOCK_SUCCESSED,
}

export enum ClaimRewardType {
  CLAIMING,
  COMPLETED,
}

export enum ClaimType {
  SWITCH_CHAIN,
  UNLOCKED_TOO_FREQUENTLY,
  UNLOCKING,
  UNLOCK_SUCCESSED,
  CLAIMING,
  COMPLETED,
}

interface FlowDepositParameters {
  safeBoxContractAddress: string;
  storagePath: string;
  amount: string;
  flowAddress: string; /// Flow wallet address
  mintChainId: string;
  destinationChainMintAddress: string; /// Receiver address: EVM wallet / Aptos wallet
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
  destinationChainWithdrawAddress: string; /// Receiver address: EVM wallet / Aptos wallet
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

interface CoMinterCap {
  minterSupply: BigNumber | undefined;
}

interface BurnConfig {
  chain_id: number;
  token: TokenInfo;
  burn_contract_addr: string;
  canonical_token_contract_addr: string;
  burn_contract_version: number;
}

/// burn_config_as_org.bridge_version === 2
/// burn_config_as_dst.bridge_version is not required
/// If the bridge_version of burnConfig1 and burnConfig2 are 2,
/// There should be two MultiBurnPairConfigs
/// 1: burnConfig1 ----> burnConfig2
/// 2: burnConfig2 ----> burnConfig1
interface MultiBurnPairConfig {
  burn_config_as_org: BurnConfig; /// Could be used only as from chain
  burn_config_as_dst: BurnConfig; /// Could be used only as to chain
}

interface S3NFTToken {
  chainid: number;
  addr: string;
}

interface S3NFTConfig {
  name: string;
  symbol: string;
  url: string;
  orig: S3NFTToken;
  pegs: S3NFTToken[];
}

interface NFTItem {
  name: string;
  img: string;
  tokenName: string;
  nftId: number;
  address: string;
  isNativeNft: boolean;
}

interface S3NFTConfigChain {
  chainid: number;
  addr: string;
}

interface NFTChain {
  chainid: number;
  name: string;
  addr: string;
  icon: string;
}

interface NFTHistory {
  // second
  createdAt: number;
  srcChid: number;
  dstChid: number;
  sender: string;
  receiver: string;
  srcNft: string;
  dstNft: string;
  tokID: string;
  srcTx: string;
  dstTx: string;
  status: number;
  txIsFailed: boolean;
}

interface NFTHistoryRequest {
  pageSize: number;
  nextPageToken: string;
}

interface NFTHistoryResponse {
  history: NFTHistory[];
  nextPageToken: number;
  pageSize: number;
}

export enum NFTBridgeStatus {
  NFT_BRIDEGE_SUBMITTING,
  NFT_BRIDEGE_WAITING_FOR_SGN,
  NFT_BRIDEGE_WAITING_DST_MINT,
  NFT_BRIDEGE_COMPLETE,
  NFT_BRIDGE_FAILED,
}

export enum NFTBridgeMode {
  UNDEFINED,
  PEGGED, // orig chain lock, dst chain mint
  BURN, // back to orig chain
  NATIVE, // token contract cross chain
  NON_ORIG_BURN, // remote mint on peg chains
}

interface ERC721TokenUriMetadata {
  image: string;
  description: string;
  name: string;
}

interface DestinationChainTransferInfo {
  delayPeriod: BigNumber | string;
  delayThresholds: BigNumber;
  epochVolumeCaps: BigNumber;
}

interface SourceChainTransferInfo {
  minAmount: BigNumber;
  maxAmount: BigNumber;
}

export enum BridgeType {
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
  sourceChainToken: TokenInfo | undefined;
  sourceChainContractAddress: string | undefined;
  sourceChainCanonicalTokenAddress: string | undefined;
  sourceChainContractVersion: number;
  bridgeType: BridgeType;
  destinationChainInfo: Chain | undefined;
  destinationToken: TokenInfo | undefined;
  destinationChainContractAddress: string | undefined;
  destinationCanonicalTokenAddress: string | undefined;
  destinationChainContractVersion: number;
  destinationChainMigrationPegBurnContractAddr: string | undefined;
}
interface LPCheckpair {
  chainInfo: Chain | undefined;
  chainToken: TokenInfo | undefined;
  chainContractAddress: string | undefined;
  chainCanonicalTokenAddress: string | undefined;
  amount: string | undefined;
}
interface ChainDelayInfo {
  delayPeriod: string;
  delayThresholds: string;
  isBigAmountDelayed: boolean;
}

interface ChainSafeguardInfo {
  minAmount: BigNumber;
  maxAmount: BigNumber;
  epochVolumes: BigNumber;
  epochVolumeCaps: BigNumber;
  lastOpTimestamps: BigNumber;
}

interface PingRequest {
  addr: string;
}

interface PingResponse {
  err: ErrMsg;
}

interface PingLPRequest {
  addr: string;
  lp_type: LPType;
}

interface PingLPResponse {
  err: ErrMsg;
}

interface LocalChainConfiguration {
  name: string;
  chainId: number | string;
  rpcUrl: string;
  walletRpcUrl?: string; // specific RPC for wallets
  iconUrl: string;
  symbol: string;
  blockExplorerUrl: string;
  tokenSymbolList: Array<string>;
  lqMintTokenSymbolBlackList: Array<string>;
}
interface PendingHistoryResponse {
  action_transfer_history: Array<TransferHistory>;
  pending_transfer_history: Array<TransferHistory>;
  action_lp_history: Array<LPHistory>;
  pending_lp_history: Array<LPHistory>;
}

type LocalChainConfigType = Record<any, LocalChainConfiguration>;

interface GetAptosSafeGaurdingInfoRequest {
  key_type: string;
  value_type: string;
  key: string;
}

interface GetAptosOriginalVaultSafeGaurdingInfoResponse {
  delay_threshold: string;
  max_deposit: string;
  min_deposit: string;
  vol_cap: string;
}

interface PriceOfTokens {
  updateEpoch: string;
  assetPrice: Array<AssetPrice>;
  gasPrice: Array<GasPrice>;
}

interface AssetPrice {
  symbol: string;
  price: number;
  extraPower10: number | undefined;
  chainIds: Array<number> | undefined;
}

interface GasPrice {
  chainId: string;
  price: string;
}
interface GetAptosPeggedBridgeSafeGaurdingInfoResponse {
  delay_threshold: string;
  max_burn: string;
  min_burn: string;
  vol_cap: string;
}

export type {
  //   LPHistoryStatus,
  Chain,
  Token,
  GetAdvancedInfoRequest,
  GetAdvancedInfoResponse,
  SetAdvancedInfoRequest,
  GetTransferConfigsResponse,
  EstimateAmtRequest,
  EstimateAmtResponse,
  MarkTransferRequest,
  GetTransferStatusRequest,
  GetTransferStatusResponse,
  // MarkTransferTypeRequest,
  GetLPInfoListRequest,
  GetLPInfoListResponse,
  MarkLiquidityRequest,
  LPInfo,
  LPList,
  WithdrawLiquidityRequest,
  WithdrawLiquidityResponse,
  QueryLiquidityStatusRequest,
  QueryLiquidityStatusResponse,
  WithdrawDetail,
  TransferHistoryRequest,
  TransferHistory,
  TransferInfo,
  TransferHistoryResponse,
  LPHistoryRequest,
  LPHistory,
  //   LPType,
  TokenInfo,
  LPHistoryResponse,
  ErrMsg,
  ClaimWithdrawRewardRequest,
  ClaimRewardDetailsRequest,
  RewardClaimDetails,
  ClaimRewardDetailsResponse,
  Reward,
  RewardingDataRequest,
  RewardingDataResponse,
  Signature,
  GetRetentionRewardsInfoRequest,
  GetRetentionRewardsInfoResponse,
  ClaimRetentionRewardsRequest,
  ClaimRetentionRewardsResponse,
  GetPercentageFeeRebateInfoRequest,
  GetPercentageFeeRebateInfoResponse,
  ClaimPercentageFeeRebateRequest,
  ClaimPercentageFeeRebateResponse,
  PeggedPairConfig,
  FlowDepositParameters,
  FlowDepositResponse,
  FlowBurnParameters,
  FlowBurnResponse,
  FlowDepositTokenConfig,
  FlowBurnTokenConfig,
  FlowTokenPathConfigs,
  FlowTokenPathConfig,
  CoMinterCap,
  BurnConfig,
  MultiBurnPairConfig,
  S3NFTConfig,
  S3NFTToken,
  NFTItem,
  NFTChain,
  S3NFTConfigChain,
  NFTHistory,
  NFTHistoryRequest,
  NFTHistoryResponse,
  ERC721TokenUriMetadata,
  DestinationChainTransferInfo,
  SourceChainTransferInfo,
  TransferPair,
  LPCheckpair,
  ChainDelayInfo,
  ChainSafeguardInfo,
  PingRequest,
  PingResponse,
  ChainTokenInfo,
  LocalChainConfiguration,
  LocalChainConfigType,
  PriceOfTokens,
  AssetPrice,
  PendingHistoryResponse,
  GetAptosSafeGaurdingInfoRequest,
  GetAptosOriginalVaultSafeGaurdingInfoResponse,
  GetAptosPeggedBridgeSafeGaurdingInfoResponse,
  PingLPRequest,
  PingLPResponse,
};
