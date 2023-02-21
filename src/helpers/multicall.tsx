import useBlockNumber from "../hooks/useBlockNumber";
import { MULTICALL_ADDRESS } from "../constants/const";
import { Multicall2__factory } from "../typechain/factories/Multicall2__factory";
import { Multicall2 } from "../typechain/Multicall2";
import { createMulticall } from "../redux-multicall";
import useReadOnlyCustomContractLoader from "../hooks/customReadyOnlyContractLoader";
import { useAppSelector } from "../redux/store";

const multicall = createMulticall();

export default multicall;

export function MulticallUpdater() {
  const latestBlockNumber = useBlockNumber();
  const { transferInfo } = useAppSelector((state) => state);
  const { fromChain, toChain, tokenSource } = transferInfo;
  const cId = tokenSource === "from" ? fromChain?.chainId : toChain?.chainId;
  const contract = useReadOnlyCustomContractLoader(
    cId,
    MULTICALL_ADDRESS[cId || 1],
    Multicall2__factory
  ) as Multicall2;
  return (
    <multicall.Updater
      chainId={cId}
      latestBlockNumber={latestBlockNumber}
      contract={contract}
    />
  );
}
