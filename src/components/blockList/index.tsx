import { getAddress } from "ethers/lib/utils";
import { ReactNode, useMemo, useState } from "react";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { getUserIsBlocked } from "../../redux/gateway";
import { setDisableTransferAddlqAggregatelqAction } from "../../redux/transferSlice";
import { useAppDispatch } from "../../redux/store";

export default function BlockList({ children }: { children: ReactNode }) {
  const { address, chainId } = useWeb3Context();
  const [isHighestLevelBlocked, setIsHighestLevelBlocked] = useState(false);
  const [isTrmBlocked, setIsTrmBlocked] = useState(false);
  const dispatch = useAppDispatch();

  useMemo(() => {
    const userBlackListStr = `${process.env.REACT_APP_USER_BLACKLIST}`;
    if (userBlackListStr && address && userBlackListStr !== "undefined") {
      const userBlackList = JSON.parse(userBlackListStr) as [string];
      const blackAddresses = userBlackList?.map(addr => getAddress(addr));
      if (blackAddresses?.includes(getAddress(address))) {
        setIsHighestLevelBlocked(true);
      }
    }

    const checkTrmBlockList = async () => {
      if (address && chainId) {
        const result = await getUserIsBlocked(address, chainId, true);
        console.log(2221, result);
        setIsTrmBlocked(result.getIsBlocked());
        // if(result.getIsBlocked()) {
        //   // sactions block with highest level
        //   if(result.getRiskCategory().toLowerCase() === "sanctions") {
        //     setIsHighestLevelBlocked(true)
        //   } else {
        //     setIsTrmBlocked(true)
        //   }
        // }
      }
    };

    checkTrmBlockList();
  }, [address, chainId]);

  if (isTrmBlocked) {
    dispatch(setDisableTransferAddlqAggregatelqAction(true));
  } else {
    dispatch(setDisableTransferAddlqAggregatelqAction(false));
  }
  if (isHighestLevelBlocked) {
    return <div>Blocked address</div>;
  }

  return <>{children}</>;
}
