import { JsonRpcProvider } from "@ethersproject/providers";
import { getNetworkById } from "../constants/network";
import { readOnlyContract } from "../hooks/customReadyOnlyContractLoader";
import { Chain } from "../proto/chainhop/common_pb";
import { MessageBusReceiver__factory } from "../typechain/factories/MessageBusReceiver__factory";
import { TransferSwapper__factory } from "../typechain/factories/TransferSwapper__factory";
import { MessageBusReceiver } from "../typechain/MessageBusReceiver";
import { TransferSwapper } from "../typechain/TransferSwapper";

export const messageReceivingChecker = async (
  messageId: string,
  destinationChain: Chain.AsObject
): Promise<boolean> => {
  const provider = new JsonRpcProvider(
    getNetworkById(destinationChain.chainId).rpcUrl
  );
  const transferSwapper = (await readOnlyContract(
    provider,
    destinationChain.executionNode,
    TransferSwapper__factory
  )) as TransferSwapper;
  const messageBusAddress = await transferSwapper.messageBus();
  const messageBusReceiver = (await readOnlyContract(
    provider,
    messageBusAddress,
    MessageBusReceiver__factory
  )) as MessageBusReceiver;
  const status = await messageBusReceiver.executedMessages(messageId);
  /// Since enum cannot be generated through typechain, use 1 as TxStatus.Success
  /// https://github.com/celer-network/sgn-v2-contracts/blob/961901e7ba77caaf2c09fac4b12e2e7bcad265a1/contracts/message/libraries/MsgDataTypes.sol#L33
  return status === 1;
};
