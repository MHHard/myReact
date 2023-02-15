import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { createUseStyles } from "react-jss";
import { initOnRamp } from "@coinbase/cbpay-js";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { Theme } from "../theme/theme";
import { setRefreshGlobalTokenBalance } from "../redux/globalInfoSlice";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>(() => ({
  payButton: {
    // color: "#fff",
  },
}));

const CoinBasePay = forwardRef((props, ref) => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const { address } = useWeb3Context();
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onrampInstance = useRef<any>();
  useImperativeHandle(ref, () => ({
    // Pass to parent component refresh function
    openCoinBasePay,
  }));
  useEffect(() => {
    if (address) {
      onrampInstance.current = initOnRamp({
        appId: "95e47197-38ca-4b86-99da-40f9c5daf789",
        widgetParameters: {
          destinationWallets: [
            {
              address,
              blockchains: ["ethereum"],
            },
          ],
        },
        onSuccess: () => {
          console.log("success,coinbasePay");
          dispatch(setRefreshGlobalTokenBalance());
        },
        onExit: () => {
          console.log("exit");
        },
        onEvent: event => {
          console.log("event", event);
        },
        experienceLoggedIn: "new_tab",
        experienceLoggedOut: "popup",
        closeOnExit: true,
        closeOnSuccess: true,
      });
    }
    return () => {
      onrampInstance.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const openCoinBasePay = () => {
    console.log("onClick", onrampInstance.current);
    onrampInstance.current?.open();
  };

  return <span className={classes.payButton}>Coinbase Pay</span>;
});
export default CoinBasePay;
