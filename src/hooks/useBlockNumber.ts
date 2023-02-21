import { atom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getNetworkById } from "../constants/network";
import useDebounce from "../hooks/useDebounce";
import useIsWindowVisible from "../hooks/useIsWindowVisible";
import { useAppSelector } from "../redux/store";

/* eslint-disable */
function useBlock() {
  const windowVisible = useIsWindowVisible();
  const { transferInfo } = useAppSelector((state) => state);
  const { fromChain, toChain, tokenSource } = transferInfo;

  const cId = useMemo(() => {
    if (tokenSource && fromChain?.chainId && toChain?.chainId) {
      return tokenSource === "from" ? fromChain?.chainId : toChain?.chainId;
    }
    return undefined;
  }, [tokenSource, fromChain?.chainId, toChain?.chainId]);

  const provider = useMemo(() => {
    if (cId) {
      const rpcUrl = getNetworkById(cId)?.rpcUrl;
      return new JsonRpcProvider(rpcUrl);
    }
    return undefined;
  }, [cId]);

  const [state, setState] = useState<{ chainId?: number; block?: number }>({
    chainId: cId,
  });

  const onBlock = useCallback(
    (block: number) => {
      setState((state) => {
        if (state.chainId === cId) {
          if (typeof state.block !== "number") return { chainId: cId, block };
          return { chainId: cId, block: Math.max(block, state.block) };
        }
        return state;
      });
    },
    [cId]
  );

  useEffect(() => {
    if (cId && windowVisible && provider) {
      // If chainId hasn't changed, don't clear the block. This prevents re-fetching still valid data.
      setState((state) => (state.chainId === cId ? state : { chainId: cId }));

      provider
        .getBlockNumber()
        .then(onBlock)
        .catch((error) => {
          console.error(`Failed to get block number for chainId ${cId}`, error);
        });

      provider.on("block", onBlock);
      return () => {
        provider.removeListener("block", onBlock);
      };
    }
    return undefined;
  }, [cId, onBlock, windowVisible, provider]);

  const debouncedBlock = useDebounce(state.block, 100);
  return state.block ? debouncedBlock : undefined;
}

const blockAtom = atom<number | undefined>(undefined);

export function BlockUpdater() {
  const setBlock = useUpdateAtom(blockAtom);
  const block = useBlock();
  useEffect(() => {
    setBlock(block);
  }, [block, setBlock]);
  return null;
}

/** Requires that BlockUpdater be installed in the DOM tree. */
export default function useBlockNumber(): number | undefined {
  const { transferInfo } = useAppSelector((state) => state);
  const { fromChain, toChain, tokenSource } = transferInfo;
  const cId = tokenSource === "from" ? fromChain?.chainId : toChain?.chainId;
  const block = useAtomValue(blockAtom);
  return cId ? block : undefined;
}

export function useFastForwardBlockNumber(): (block: number) => void {
  return useUpdateAtom(blockAtom);
}
