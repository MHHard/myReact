import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { useToggle } from "react-use";
import { Token } from "../constants/type";
import { ERC20__factory } from "../typechain/typechain";
import { useWeb3Context } from "../providers/Web3ContextProvider";

export type UseBalanceReturn = [BigNumber, boolean, string, () => void];

function useTokenBalance(token: Token, timeout = 3000, getNetworkById): UseBalanceReturn {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [reloadTrigger, reload] = useToggle(false);
  const { address } = useWeb3Context();

  useEffect(() => {
    setError("");

    if (!address || !ethers.utils.isAddress(token.address)) {
      return;
    }

    // fix nervos chain can't get balance who has not register the L2 account,
    // error: from id not found by from address:xx have you deposited?
    let overrides = {};
    if (token.chainId === 71402) {
      overrides = { from: "0x9FEaB89C449C90282c93D0b532029eFA72eA00c8" };
    }

    let balancePromise;
    const jsonRpcProvider = new StaticJsonRpcProvider(getNetworkById(token.chainId).rpcUrl);
    if (token.isNative) {
      console.debug("native token load");
      balancePromise = jsonRpcProvider.getBalance(address);
    } else {
      balancePromise = ERC20__factory.connect(token.address, jsonRpcProvider).balanceOf(address, overrides);
    }

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
        console.error("get balance error", err);
        setError(err.message);
      })
      .finally(() => setBalanceLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token.chainId, token.address, reloadTrigger, timeout, address, token.isNative]);

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
