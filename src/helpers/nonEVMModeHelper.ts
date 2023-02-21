
// eslint-disable-next-line
export enum NonEVMMode {
    off, // Both from and to chains are EVM
    flowTest,
    flowMainnet,
    terraTest,
    terraMainnet,
}

export const getNonEVMMode = (targetChainId: number) => {
    if (targetChainId === 12340001) {
        return NonEVMMode.flowMainnet;
    }

    if (targetChainId === 12340002) {
        return NonEVMMode.flowTest;
    }

    if (targetChainId === 999999998) {
        return NonEVMMode.terraMainnet;
    }

    if (targetChainId === 999999999) {
        return NonEVMMode.terraTest;
    }

    return NonEVMMode.off;
};
  