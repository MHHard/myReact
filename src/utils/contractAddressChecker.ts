import { message } from "antd";

export const checkContractAddress = (isTestNet ,checkData: string, contractAddress: string) => {
    if(!isTestNet && checkData?.toLowerCase() !== contractAddress?.toLowerCase()) {
        message.error(
            `Wrong Contract Address. Expected: ${checkData}, Found: ${contractAddress}. Please report to customer support and don't submit transaction`,
          );
        throw new Error("config and sgn ops data contract addr not matched");
    }
}