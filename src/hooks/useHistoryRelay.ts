import { useEffect, useState } from "react";
import { message } from "antd";
import { base64, getAddress, hexlify } from "ethers/lib/utils";
import { BigNumber } from "@ethersproject/bignumber";
import { PeggedPairConfig, TransferHistory, TransferHistoryStatus } from "../constants/type";
import { GetTransferRelayInfoRequest, GetTransferRelayInfoResponse } from "../proto/gateway/gateway_pb";
import { getTransferRelayInfo } from "../redux/gateway";
import { PeggedChainMode } from "./usePeggedPairConfig";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import useCustomContractLoader from "./customContractLoader";
import { Bridge } from "../typechain/typechain";
import { Bridge__factory } from "../typechain/typechain/factories/Bridge__factory";
import { PeggedTokenBridge__factory } from "../typechain/typechain/factories/PeggedTokenBridge__factory";
import { PeggedTokenBridgeV2__factory } from "../typechain/typechain/factories/PeggedTokenBridgeV2__factory";
import { OriginalTokenVault__factory } from "../typechain/typechain/factories/OriginalTokenVault__factory";
import { OriginalTokenVaultV2__factory } from "../typechain/typechain/factories/OriginalTokenVaultV2__factory";
import { useAppSelector } from "../redux/store";
import { storageConstants } from "../constants/const";
import { useMultiBurnConfig } from "./useMultiBurnConfig";
import { submitAptosProxyRegisterAndMintRequest } from "../redux/NonEVMAPIs/aptosAPIs";
import { isAptosChain, useNonEVMContext } from "../providers/NonEVMContextProvider";


export const useHistoryRelay = (
    speedUpItem: TransferHistory | undefined,
    speedUpPeggedMode: PeggedChainMode | undefined,
) => {
    const fromChainId = speedUpItem?.src_send_info?.chain?.id;
    const toChainId = speedUpItem?.dst_received_info?.chain?.id;
    const symbol = speedUpItem?.dst_received_info?.token.symbol;

    const { multiBurnConfig } = useMultiBurnConfig(fromChainId, toChainId, symbol);
    const { transferInfo } = useAppSelector(state => state);
    const { transferConfig } = transferInfo;
    const [relayContractAddress, setRelayContractAddress] = useState('');
    const [pegConfig, setPegConfig] = useState<PeggedPairConfig>();

    useEffect(() => {
      let contractAddress;
      const depositConfigs = transferConfig?.pegged_pair_configs?.find(
        e =>
          e.org_chain_id === fromChainId &&
          e.pegged_chain_id === toChainId &&
          e.org_token.token.symbol === symbol,
      );
      const burnConfigs = transferConfig?.pegged_pair_configs?.find(
        e =>
          e.org_chain_id === toChainId &&
          e.pegged_chain_id === fromChainId &&
          e.org_token.token.symbol === symbol,
      );

      const list = transferConfig?.chains.filter(item => item.id === toChainId);

      switch (speedUpPeggedMode) {
        case PeggedChainMode.Deposit:
          setPegConfig(depositConfigs);
          contractAddress = depositConfigs?.pegged_burn_contract_addr;
          break;
        case PeggedChainMode.Burn:
        case PeggedChainMode.BurnThenSwap:
          setPegConfig(burnConfigs);
          contractAddress = burnConfigs?.pegged_deposit_contract_addr;
          break;
        default:
          if(multiBurnConfig) {
            contractAddress = multiBurnConfig.burn_config_as_dst.burn_contract_addr;
          } else {
            contractAddress = list.length ? list[0].contract_addr : "";
          }
          break;
      }
      setRelayContractAddress(contractAddress);
    }, [fromChainId, toChainId, symbol, speedUpPeggedMode, transferConfig, multiBurnConfig]);

    const { signer } = useWeb3Context();
    const { signAndSubmitTransaction } = useNonEVMContext()
    const peggedTokenBridge = useCustomContractLoader(signer, relayContractAddress, PeggedTokenBridge__factory);
    const peggedTokenBridgeV2 = useCustomContractLoader(signer, relayContractAddress, PeggedTokenBridgeV2__factory)
    const originalTokenVault = useCustomContractLoader(signer, relayContractAddress, OriginalTokenVault__factory);
    const originalTokenVaultV2 = useCustomContractLoader(signer, relayContractAddress, OriginalTokenVaultV2__factory);
    const dstBridge = useCustomContractLoader(signer, relayContractAddress, Bridge__factory) as Bridge | undefined;

    const speedUp = async (): Promise<string | undefined> => {
        if(!speedUpItem) return undefined;
        const req = new GetTransferRelayInfoRequest();
        req.setTransferId(speedUpItem.transfer_id);
        const res: GetTransferRelayInfoResponse = await getTransferRelayInfo(req);
        if (!res.getErr()) {
            if (isAptosChain(speedUpItem.dst_received_info.chain.id)) {
              return submitAptosRegisterMintRelay(res, speedUpItem)
            }

            const { request, signersList, sortedSigsList, powersList } = res.toObject();
            const wdmsg = base64.decode(request as string);
            const signers = signersList.map(item => {
                const decodeSigners = base64.decode(item as string);
                const hexlifyObj = hexlify(decodeSigners);
                return getAddress(hexlifyObj);
            });
            const sigs = sortedSigsList.map(item => {
                return base64.decode(item as string);
            });
            const powers = powersList.map(item => {
                const decodeNum = base64.decode(item as string);
                return BigNumber.from(decodeNum);
            });

            let relay;
            if (!peggedTokenBridge || !originalTokenVault || !dstBridge || !peggedTokenBridgeV2 || !originalTokenVaultV2) return undefined;
            try {
                switch (speedUpPeggedMode) {
                case PeggedChainMode.Deposit:
                    if(!pegConfig) break;
                    relay = pegConfig.bridge_version > 0 ?  await peggedTokenBridgeV2.mint(wdmsg, sigs, signers, powers): await peggedTokenBridge.mint(wdmsg, sigs, signers, powers);
                    break;
                case PeggedChainMode.Burn:
                case PeggedChainMode.BurnThenSwap:
                    if(!pegConfig) break;
                    relay = pegConfig.vault_version > 0 ? await originalTokenVaultV2.withdraw(wdmsg, sigs, signers, powers) : await originalTokenVault.withdraw(wdmsg, sigs, signers, powers);
                    break;
                default:
                    if(multiBurnConfig) {
                      relay = await peggedTokenBridgeV2.mint(wdmsg, sigs, signers, powers);
                    } else {
                      relay = await dstBridge.relay(wdmsg, sigs, signers, powers);
                    }
                    break;
                }
            } catch (e) {
                // message.error("Relay error.");
                console.log(e);
                return undefined;
            }

            if (relay) return relay.hash;
        } else {
            console.log('fetch relay params error', res.toObject());
            message.error("Relay error.");
        }
        return undefined;
    }

    const submitAptosRegisterMintRelay = (
        localAptosRelayInfo: GetTransferRelayInfoResponse,
        historyItem: TransferHistory) => {
      try {
        const wdmsg = base64.decode(localAptosRelayInfo.toObject().request.toString());
        const sigs = localAptosRelayInfo.toObject().sortedSigsList.map(item => {
          return base64.decode(item.toString());
        });
        const signers = localAptosRelayInfo.toObject().signersList.map(item => {
          return base64.decode(item.toString());
        });
        const powers = localAptosRelayInfo.toObject().powersList.map(item => {
          return BigNumber.from(base64.decode(item.toString())).toString();
        });
  
        return submitAptosProxyRegisterAndMintRequest(
          historyItem.dst_received_info.chain.contract_addr.replace("0x", ""), 
          historyItem.dst_received_info.token.address,
          wdmsg,
          sigs,
          signers,
          powers,
          signAndSubmitTransaction,
        )
      } catch(error) {
        console.debug("error", error)
        return undefined
      }  
    }
    
    return speedUp;
}


export const getRelayTimeMap = () => {
    let relayTimeMap = new Map();
    const relayTimeStr = localStorage.getItem(storageConstants.KEY_TRANSFER_RELAY_TIME_LIST);
    if(relayTimeStr) relayTimeMap = new Map(JSON.parse(relayTimeStr));
    return relayTimeMap;
}

export const setLocalRelayTime = (item: TransferHistory) => {
    const map = getRelayTimeMap();
    const hash = item.src_block_tx_link.match('[^/]+(?!.*/)') || [];
    if(item.status === TransferHistoryStatus.TRANSFER_WAITING_FOR_FUND_RELEASE) {
      if(!map.has(hash[0])) {
        map.set(hash[0], Number(item.update_ts));
        localStorage.setItem(storageConstants.KEY_TRANSFER_RELAY_TIME_LIST, JSON.stringify(Array.from(map.entries())));
      }
    }
    if(item.status === TransferHistoryStatus.TRANSFER_COMPLETED) {
      if(map.has(hash[0])) {
        map.delete(hash[0]);
        localStorage.setItem(storageConstants.KEY_TRANSFER_RELAY_TIME_LIST, JSON.stringify(Array.from(map.entries())));
      }
    }
  }