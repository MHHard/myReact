import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useToggle } from "react-use";
import { isNonEVMChain } from "../providers/NonEVMContextProvider";
import { ERC20 } from "../typechain/typechain/ERC20";

export type UseBalanceReturn = [BigNumber, boolean, string, () => void];

function useTokenBalance(
  tokenContract: ERC20 | undefined,
  address: string,
  chainId = 1,
  timeout = 3000,
): UseBalanceReturn {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [reloadTrigger, reload] = useToggle(false);

  useEffect(() => {
    setError("");
  
    if (!tokenContract || !address || !ethers.utils.isAddress(tokenContract.address) || isNonEVMChain(chainId)) {
      return;
    }

    // fix nervos chain can't get balance who has not register the L2 account,
    // error: from id not found by from address:xx have you deposited?
    let overrides = {};
    if (chainId === 71402) {
      overrides = { from: "0x9FEaB89C449C90282c93D0b532029eFA72eA00c8" };
    }

    const balancePromise = tokenContract.balanceOf(address, overrides);

    let timeoutTimer: NodeJS.Timeout;
    const timeoutPromise = new Promise<BigNumber>((_, reject) => {
      timeoutTimer = setTimeout(() => {
        reject(new Error("Token balance fetching timed out"));
      }, timeout);
    });

    setBalanceLoading(true);

    Promise.race([balancePromise, timeoutPromise])
      .then((bal: BigNumber) => {
        clearTimeout(timeoutTimer);
        setError("");
        setRetryCount(0);
        setBalance(bal);
      })
      .catch((err: Error) => {
        console.error("get balance error", err)
        setError(err.message)
      })
      .finally(() => setBalanceLoading(false));


  }, [tokenContract, address, reloadTrigger, timeout, chainId]);

  useEffect(() => {
    if (error && retryCount < 3) {
      console.debug("reloading balance, retry", retryCount);
      setRetryCount(retryCount + 1);
      reload();
    }
  }, [error, retryCount, reload]);

  return [balance, balanceLoading, error, reload];
}

export default useTokenBalance;
