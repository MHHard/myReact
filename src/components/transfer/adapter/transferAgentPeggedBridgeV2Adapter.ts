import { BigNumber, ethers } from "ethers";

import { Chain, TokenInfo } from "../../../constants/type";
import { TransferAgent } from "../../../typechain/typechain";
import { Transactor } from "../../../helpers/transactorWithNotifier";
import { getNetworkById } from "../../../constants/network";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";

export default class TransferAgentPeggedBridgeV2Adapter implements ITransferAdapter{
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

    peggedTokenBridgeV2Address: string;

    constructor(params: ITransfer, peggedTokenBridgeV2Address: string) {
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
        this.peggedTokenBridgeV2Address = peggedTokenBridgeV2Address;
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
            ["address", "address", "uint256", "uint64", "address", "uint64", "uint64", "address"],
            [
              this.transferAgentContractAddress, /// transfer agent address
              this.tokenInfo.token.address, /// selected token address
              this.value.toString(), /// bridge amount
              this.toChain?.id.toString(), /// destination chain id
              ethers.constants.AddressZero, // hardcoded address.zero
              this.nonce.toString(), /// nonce
              this.fromChain?.id.toString(), /// source chain id
              this.peggedTokenBridgeV2Address,
            ],
        );
      }
  
    getInteractContract(): string[] {
        return [sgnOpsDataCheck[this.fromChain.id]?.transferAgent, this.contract?.address, 
            sgnOpsDataCheck[this.fromChain.id]?.ptbridge2, this.peggedTokenBridgeV2Address]; 
    }

    transfer() {
        if(!this.transactor || !this.contract) return;
        // https://github.com/celer-network/sgn-v2-contracts/blob/f89b6458ec87551320e1dd84d89bb49821ebb770/contracts/libraries/BridgeTransferLib.sol#L28
        // eslint-disable-next-line consistent-return
        return this.transactor(
            this.contract.transfer(
                this.toAccount, 
                this.tokenInfo.token.address,
                this.value, 
                this.toChain?.id ?? 0, 
                this.nonce, 
                0, 
                5, /// BridgeSendType.PegV2Burn
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