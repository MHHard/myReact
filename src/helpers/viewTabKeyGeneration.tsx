export const TabKeys =  {
    Transfer: "transfer",
    Liquidity: "liquidity",
    NFT: "nft",
    Rewards: "rewards",
}

export const generateTabKey = (pathname: string) => {
    const segments = pathname.split("/").filter(p => p);
    let targetTabKey = segments[0] ?? ""
 
    if (!Object.values(TabKeys).map(value => {
      return value
    }).includes(targetTabKey)) {
      targetTabKey = TabKeys.Transfer
    }
    return targetTabKey
}
  