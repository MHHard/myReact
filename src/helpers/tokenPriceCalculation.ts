import { AssetPrice } from "../constants/type";

export const getTokenUnitPriceInUSD = (tokenPrice: AssetPrice) => {
    const power = Number(tokenPrice.extraPower10 ?? 0) + 4
    return tokenPrice.price / (10 ** power)
}