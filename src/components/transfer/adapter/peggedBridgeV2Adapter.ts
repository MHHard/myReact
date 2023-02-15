
import { BigNumber, ethers } from "ethers";
import { Chain } from "../../../constants/type";
import { pegV2ThirdPartDeployTokens } from "../../../constants/const";
import { PeggedTokenBridgeV2 } from "../../../typechain/typechain";
import { Transactor } from "../../../helpers/transactorWithNotifier";
import { getNetworkById } from "../../../constants/network";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";

export default class PeggedBridgeV2Adapter implements ITransferAdapter{
    value: BigNumber;

    address: string;

    burnTokenAddress: string;

    fromChain: Chain;

    toChain: Chain;

    receiverEVMCompatibleAddress: string;

    toAccount: string;

    nonce = new Date().getTime();

    contract: PeggedTokenBridgeV2 | undefined;

    transactor: Transactor<ethers.ContractTransaction> | undefined;

    transferId = '';

    srcBlockTxLink = '';
 
    srcAddress = '';

    dstAddress: string;

    constructor(params: ITransfer, burnTokenAddress) {
        this.burnTokenAddress = burnTokenAddress;
        this.value = params.value;
        this.address = params.address;
        this.toChain = params.toChain;
        this.fromChain = params.fromChain;
        this.receiverEVMCompatibleAddress = params.receiverEVMCompatibleAddress;
        this.toAccount = params.toAccount;
        this.dstAddress = params.dstAddress;
        this.contract = params.contracts.peggedTokenBridgeV2;
        this.transactor = params.transactor;
    }

    getTransferId(): string {
        return ethers.utils.solidityKeccak256(
            ["address", "address", "uint256", "uint64", "address", "uint64", "uint64", "address"],
            [
              this.address,
              this.burnTokenAddress,
              this.value.toString(),
              this.toChain?.id.toString(),
              this.toAccount,
              this.nonce.toString(),
              this.fromChain?.id.toString(),
              this.contract?.address,
            ],
        );
      }
  
    getInteractContract(): string[] {
        return [sgnOpsDataCheck[this.fromChain.id]?.ptbridge2, this.contract?.address];
    }

    transfer() {
        if(!this.transactor || !this.contract) return;
        if (pegV2ThirdPartDeployTokens[this.fromChain?.id]?.includes(this.burnTokenAddress)) {
            // eslint-disable-next-line consistent-return
            return this.transactor(this.contract?.burnFrom(
                this.burnTokenAddress,
                this.value,
                this.toChain?.id ?? 0,
                this.toAccount,
                this.nonce,
            ))
        } 
        // eslint-disable-next-line consistent-return
        return this.transactor(this.contract?.burn(
            this.burnTokenAddress,
            this.value,
            this.toChain?.id ?? 0,
            this.toAccount,
            this.nonce,
        ))   
    }

    isResponseValid = (response) => {
        const newtxStr = JSON.stringify(response);
        const newtx = JSON.parse(newtxStr);
        return !newtx.code;
      }
  
    onSuccess(response) {
        this.transferId = this.getTransferId();
        this.srcBlockTxLink = `${getNetworkById(this.fromChain.id).blockExplorerUrl}/tx/${response.hash}`;
        this.srcAddress = this.address;
    }

    estimateGas = async () => {
        if(!this.transactor || !this.contract) return;
        if (pegV2ThirdPartDeployTokens[this.fromChain?.id]?.includes(this.burnTokenAddress)) {
            // eslint-disable-next-line consistent-return
            return this.contract?.estimateGas.burnFrom(
                this.burnTokenAddress,
                this.value,
                this.toChain?.id ?? 0,
                this.toAccount,
                this.nonce,
            )
        } 
        // eslint-disable-next-line consistent-return
        return this.contract?.estimateGas.burn(
            this.burnTokenAddress,
            this.value,
            this.toChain?.id ?? 0,
            this.toAccount,
            this.nonce,
        ) 
      }
}