import { BigNumber, ethers } from "ethers";
import { Chain, TokenInfo } from "../../../constants/type";
import { OriginalTokenVaultV2 } from "../../../typechain/typechain";
import { Transactor } from "../../../helpers/transactorWithNotifier";
import { isApeChain } from "../../../hooks/useTransfer";
import { PeggedPair } from "../../../hooks/usePeggedPairConfig";
import { getNetworkById } from "../../../constants/network";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";

export default class OriginalTokenVaultV2Adapter implements ITransferAdapter {
  isNative: boolean;

  value: BigNumber;

  address: string;

  fromChain: Chain;

  toChain: Chain;

  selectedToken: TokenInfo;

  toAccount: string;

  nonce = new Date().getTime();

  pegConfig: PeggedPair;

  contract: OriginalTokenVaultV2 | undefined;

  transactor: Transactor<ethers.ContractTransaction> | undefined;

  dstAddress: string;

  transferId = "";

  srcBlockTxLink = "";

  srcAddress = "";

  constructor(params: ITransfer) {
    this.isNative = params.isNativeToken;
    this.value = params.value;
    this.address = params.address;
    this.toChain = params.toChain;
    this.fromChain = params.fromChain;
    this.selectedToken = params.selectedToken;
    this.toAccount = params.toAccount;
    this.dstAddress = params.dstAddress;
    this.pegConfig = params.pegConfig;
    this.contract = params.contracts.originalTokenVaultV2;
    this.transactor = params.transactor;
  }

  getTransferId(): string {
    return ethers.utils.solidityKeccak256(
      ["address", "address", "uint256", "uint64", "address", "uint64", "uint64", "address"],
      [
        this.address,
        this.selectedToken?.token?.address,
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
    return [sgnOpsDataCheck[this.fromChain.id]?.otvault2, this.contract?.address];
  }

    transfer = async () => {
        if(!this.transactor || !this.contract) return
        let wrapTokenAddress;
        try {
          wrapTokenAddress = await this.contract?.nativeWrap();
        } catch (e) {
          console.log("wrap token not support");
        }
        if (wrapTokenAddress === this.selectedToken.token.address) {

            // except the case of Ethereum WETH
            if(this.fromChain.id === 1 && this.selectedToken.token.display_symbol !== "ETH") {

              // eslint-disable-next-line consistent-return
              return this.transactor(
                this.contract?.deposit(
                  this.pegConfig.config.org_token.token.address,
                  this.value,
                  this.pegConfig.config.pegged_chain_id,
                  this.toAccount,
                  this.nonce,
                ),
              );
            }
          
            if (isApeChain(this.fromChain.id)) {
                // eslint-disable-next-line consistent-return
                return this.transactor(
                    this.contract?.depositNative(
                      this.value,
                      this.pegConfig.config.pegged_chain_id,
                      this.toAccount,
                      this.nonce,
                      { value: this.value, gasPrice: 0 },
                    ),
                )
            }

            // eslint-disable-next-line consistent-return
            return this.transactor(
                this.contract?.depositNative(
                  this.value,
                  this.pegConfig.config.pegged_chain_id,
                  this.toAccount,
                  this.nonce,
                  { value: this.value },
                ),
            )
        }
        if (isApeChain(this.fromChain.id)) {
            // eslint-disable-next-line consistent-return
            return this.transactor(
                this.contract?.deposit(
                  this.pegConfig.config.org_token.token.address,
                  this.value,
                  this.pegConfig.config.pegged_chain_id,
                  this.toAccount,
                  this.nonce,
                  { gasPrice: 0 },
                ),
            )
        }

        // eslint-disable-next-line consistent-return
        return this.transactor(
            this.contract?.deposit(
              this.pegConfig.config.org_token.token.address,
              this.value,
              this.pegConfig.config.pegged_chain_id,
              this.toAccount,
              this.nonce,
            ),
          )
    }

  isResponseValid = response => {
    const newtxStr = JSON.stringify(response);
    const newtx = JSON.parse(newtxStr);
    return !newtx.code;
  };

    onSuccess(response) {
        this.transferId = this.getTransferId();
        this.srcBlockTxLink = `${getNetworkById(this.fromChain.id).blockExplorerUrl}/tx/${response.hash}`;
        this.srcAddress = this.address;
    }

    estimateGas = async () => {
      if(!this.transactor || !this.contract) return
        let wrapTokenAddress;
        try {
          wrapTokenAddress = await this.contract?.nativeWrap();
        } catch (e) {
          console.log("wrap token not support");
        }
        if (wrapTokenAddress === this.pegConfig.config.org_token.token.address) {
            if (isApeChain(this.fromChain.id)) {
                // eslint-disable-next-line consistent-return
                return this.contract?.estimateGas.depositNative(
                      this.value,
                      this.pegConfig.config.pegged_chain_id,
                      this.toAccount,
                      this.nonce,
                      { value: this.value, gasPrice: 0 },
                    );
            }
            // eslint-disable-next-line consistent-return
            return this.contract?.estimateGas.depositNative(
                  this.value,
                  this.pegConfig.config.pegged_chain_id,
                  this.toAccount,
                  this.nonce,
                  { value: this.value },
            );
        }
        if (isApeChain(this.fromChain.id)) {
            // eslint-disable-next-line consistent-return
            return this.contract?.estimateGas.deposit(
                  this.pegConfig.config.org_token.token.address,
                  this.value,
                  this.pegConfig.config.pegged_chain_id,
                  this.toAccount,
                  this.nonce,
                  { gasPrice: 0 },
            );
            
        }
        // eslint-disable-next-line consistent-return
        return this.contract?.estimateGas.deposit(
              this.pegConfig.config.org_token.token.address,
              this.value,
              this.pegConfig.config.pegged_chain_id,
              this.toAccount,
              this.nonce,
            );    
    }
}
