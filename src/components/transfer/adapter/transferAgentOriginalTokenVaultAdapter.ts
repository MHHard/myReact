import { BigNumber, ethers } from "ethers";

import { Chain, TokenInfo } from "../../../constants/type";
import { TransferAgent } from "../../../typechain/typechain";
import { Transactor } from "../../../helpers/transactorWithNotifier";
import { getNetworkById } from "../../../constants/network";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";

export default class TransferAgentOriginalTokenVaultAdapter implements ITransferAdapter{
    value: BigNumber;

    address: string;

    tokenInfo: TokenInfo;

    fromChain: Chain;

    toChain: Chain;

    receiverEVMCompatibleAddress: string;

    toAccount: string;

    nonce = new Date().getTime();

    contract: TransferAgent | undefined;

    transactor: Transactor<ethers.ContractTransaction> | undefined;

    transferId = '';

    srcBlockTxLink = '';
 
    srcAddress = '';

    dstAddress: string;

    transferAgentContractAddress: string;

    shouldUseTransferNative: boolean;

    constructor(params: ITransfer, shouldUseTransferNative: boolean) {
        this.tokenInfo = params.selectedToken;
        this.value = params.value;
        this.address = params.address;
        this.toChain = params.toChain;
        this.fromChain = params.fromChain;
        this.receiverEVMCompatibleAddress = params.receiverEVMCompatibleAddress;
        this.toAccount = params.toAccount;
        this.dstAddress = params.dstAddress;
        this.contract = params.contracts.transferAgent;
        this.transactor = params.transactor;
        this.transferAgentContractAddress = params.contracts.transferAgent?.address ?? ""
        this.shouldUseTransferNative = shouldUseTransferNative
    }

    getTransferId(): string {       
        /// Attention!!!!!!!!!!!!!!
        /// Don't delete comment here to avoid transfer Id calculation misunderstanding
        /// Moreover, calculation should change when bridge type changed.
        /// For Aptos Demo Usage, hardcode bridge type as Deposit 
        /// Please refer to: 
        /// https://github.com/celer-network/sgn-v2-contracts/pull/172/files
        /// https://github.com/celer-network/sgn-v2-contracts/blob/main/contracts/libraries/BridgeTransferLib.sol

        return ethers.utils.solidityKeccak256(
            ["address", "address", "uint256", "uint64", "address", "uint64", "uint64"],
            [
              this.transferAgentContractAddress, /// transfer agent address
              this.tokenInfo.token.address, /// selected token address
              this.value.toString(), /// bridge amount
              this.toChain?.id.toString(), /// destination chain id
              ethers.constants.AddressZero, // hardcoded address.zero
              this.nonce.toString(), /// nonce
              this.fromChain?.id.toString(), /// source chain id
            ],
        );
      }
  
    getInteractContract(): string[] {
        return [sgnOpsDataCheck[this.fromChain.id]?.transferAgent, this.contract?.address]; 
    }

    transfer() {
        if(!this.transactor || !this.contract) return;

        if (this.shouldUseTransferNative) {
            // eslint-disable-next-line consistent-return
            return this.transactor(
                this.contract.transferNative(
                    this.toAccount, 
                    this.value, 
                    this.toChain?.id ?? 0, 
                    this.nonce, 
                    0, 
                    2,  /// BridgeSendType.PegDeposit
                    [], 
                    { value: this.value },
                )
            )   
        }
               
        // eslint-disable-next-line consistent-return
        return this.transactor(
            this.contract.transfer(
                this.toAccount, 
                this.tokenInfo.token.address,
                this.value, 
                this.toChain?.id ?? 0, 
                this.nonce, 
                0, 
                2,  /// BridgeSendType.PegDeposit
                []
            )
        )   
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
        return BigNumber.from(0)
      }
}