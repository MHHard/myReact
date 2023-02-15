import { SignAgainRequest, SignAgainResponse, SignAgainType } from "../proto/gateway/gateway_pb";
import { signAgain } from "../redux/gateway";

export const useSignAgain = (address: string, chainId: number, seqNum: number, refundId?: string) => {
    const initiateSignAgain = async (): Promise<boolean> => {
        const req = new SignAgainRequest();
        if(refundId) req.setRefundId(refundId);
        req.setType(refundId ? SignAgainType.SAT_REFUND : SignAgainType.SAT_LIQUIDITY);
        req.setUsrAddr(address);
        req.setChainId(chainId);
        req.setSeqNum(Number(seqNum));
        const res: SignAgainResponse = await signAgain(req);
        if (res.getErr()) {
           console.debug('sign again error:', res.getErr());
           return false;
        }
        return true;
    }
    return initiateSignAgain;
}