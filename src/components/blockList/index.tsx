import { getAddress } from "ethers/lib/utils";
import { ReactNode, useMemo, useState } from "react";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { getUserIsBlocked } from "../../redux/gateway";

export default function BlockList({ children }: { children: ReactNode }) {
  const { address, chainId } = useWeb3Context();
  const [isBlocked, setIsBlocked] = useState(false);
  const [isTrmBlocked, setIsTrmBlocked] = useState(false);

  useMemo(() => {
    const userBlackListStr = `${process.env.REACT_APP_USER_BLACKLIST}`;
    if (userBlackListStr && address && userBlackListStr !== "undefined") {
      const userBlackList = JSON.parse(userBlackListStr) as [string];
      const blackAddresses = userBlackList?.map(addr => getAddress(addr));
      if (blackAddresses?.includes(getAddress(address))) {
        setIsBlocked(true);
      }
    }

    const checkTrmBlockList =async () => {
      if(address && chainId) {
       const result = await getUserIsBlocked(address, chainId, true);
       setIsTrmBlocked(result);
      }
    }

    checkTrmBlockList();
    
  }, [address, chainId]);

  if (isBlocked || isTrmBlocked) {
    return <div>Blocked address</div>;
  }

  return <>{children}</>;
}
