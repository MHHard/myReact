import { BigNumber } from "ethers";
import { getNetworkById } from "../../../constants/network";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";
import { Chain, FlowBurnParameters, FlowDepositParameters, FlowTokenPathConfig, TokenInfo } from "../../../constants/type";
import { burnFromFlow, depositFromFlow } from "../../../redux/NonEVMAPIs/flowAPIs";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";

export default class FlowBridgeAdapter implements ITransferAdapter {
    isTestNet: boolean;

    flowDepositContractAddress: string;

    flowBurnContractAddress: string;

    flowTokenPathConfigs: FlowTokenPathConfig[];

    fromChain: Chain;

    toChain: Chain;

    selectedToken: TokenInfo;

    amount: string;

    nonEVMAddress: string;

    nonEVMReceiverAddress: string;

    nonce = new Date().getTime();

    depositParameter: FlowDepositParameters | undefined = undefined;

    burnParameter: FlowBurnParameters | undefined = undefined;

    flowContractAddress = '';

    transferId = '';

    srcBlockTxLink = '';
 
    srcAddress = '';

    dstAddress = '';

    constructor(params: ITransfer, flowDepositContractAddress: string, flowBurnContractAddress: string) {
      this.flowDepositContractAddress = flowDepositContractAddress;
      this.flowBurnContractAddress = flowBurnContractAddress;
      this.isTestNet = params.isTestNet;
      this.flowTokenPathConfigs = params.flowTokenPathConfigs;
      this.fromChain = params.fromChain;
      this.toChain = params.toChain;
      this.selectedToken = params.selectedToken;
      this.amount = params.amount;
      this.nonEVMAddress = params.nonEVMAddress;
      this.nonEVMReceiverAddress = params.nonEVMReceiverAddress;
      this.init()
    }

    init() {
        const flowTokenPath = this.flowTokenPathConfigs.find(config => config.Symbol === this.selectedToken?.token.symbol);
        if (this.flowDepositContractAddress) {
          this.flowContractAddress = this.flowDepositContractAddress;
          this.depositParameter = {
            safeBoxContractAddress: this.flowDepositContractAddress,
            storagePath: flowTokenPath?.StoragePath ?? "",
            amount: this.amount,
            flowAddress: this.nonEVMAddress,
            mintChainId: (this.toChain?.id ?? 0).toString(),
            destinationChainMintAddress: this.nonEVMReceiverAddress,
            nonce: this.nonce.toString(),
            tokenAddress: this.selectedToken?.token.address ?? "",
          };
        }

        if (this.flowBurnContractAddress) {
          this.flowContractAddress = this.flowBurnContractAddress
          this.burnParameter = {
            pegBridgeAddress: this.flowBurnContractAddress,
            storagePath: flowTokenPath?.StoragePath ?? "",
            amount: this.amount,
            flowAddress: this.nonEVMAddress,
            withdrawChainId: (this.toChain?.id ?? 0).toString(),
            destinationChainWithdrawAddress: this.nonEVMReceiverAddress,
            nonce: this.nonce.toString(),
            tokenAddress: this.selectedToken?.token.address ?? "",
          };
        }
    }

    // eslint-disable-next-line class-methods-use-this
    getTransferId(): string {
      return '';
    }

    getInteractContract(): string[] {
      return [sgnOpsDataCheck[12340001]?.ptbridge, this.flowContractAddress];
    }

    transfer = async () => {
      if(this.depositParameter) {
        return depositFromFlow(this.depositParameter)
      }
      if(this.burnParameter) {
        return burnFromFlow(this.burnParameter)
      }
      return undefined;
    }
    
    isResponseValid = (response) => {
      return response.flowTransanctionId.length > 0;
    } 

    onSuccess = (response) => {
      this.transferId = response.transferId;
      this.srcBlockTxLink = `${getNetworkById(this.fromChain?.id ?? 0).blockExplorerUrl}/transaction/${response.flowTransanctionId}`;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.srcAddress = this.burnParameter ? this.burnParameter.flowAddress : this.depositParameter!.flowAddress;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.dstAddress = this.burnParameter ? this.burnParameter.destinationChainWithdrawAddress : this.depositParameter!.destinationChainMintAddress;
    }

    estimateGas = async () => {
      return BigNumber.from(0)
    }
  }