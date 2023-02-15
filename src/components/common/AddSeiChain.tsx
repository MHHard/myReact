import { Window as KeplrWindow } from "@keplr-wallet/types";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(() => ({
  title: {
    textAlign: "center",
  },
}));

// interface ChainInfoProps {
//   readonly rpc: string;
//   readonly rest: string;
//   readonly chainId: string;
//   readonly chainName: string;
//   /**
//    * This indicates the type of coin that can be used for stake.
//    * You can get actual currency information from Currencies.
//    */
//   readonly stakeCurrency: Currency;
//   readonly walletUrlForStaking?: string;
//   readonly bip44: {
//     coinType: number;
//   };
//   readonly alternativeBIP44s?: BIP44[];
//   readonly bech32Config: Bech32Config;

//   readonly currencies: AppCurrency[];
//   /**
//    * This indicates which coin or token can be used for fee to send transaction.
//    * You can get actual currency information from Currencies.
//    */
//   readonly feeCurrencies: FeeCurrency[];

//   /**
//    * Indicate the features supported by this chain. Ex) cosmwasm, secretwasm ...
//    */
//   readonly features?: string[];
// }
const AddSeiChain = ({ rpcUrl, restUrl, chainId }) => {
  const classes = useStyles();
  const r = "sei";
  const chainInfo = {
    rpc: rpcUrl || "",
    rest: restUrl || "",
    chainId,
    chainName: "localhost",
    stakeCurrency: {
      coinDenom: "SEI",
      coinMinimalDenom: "usei",
      coinDecimals: 6,
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: r,
      bech32PrefixAccPub: "".concat(r, "pub"),
      bech32PrefixValAddr: "".concat(r, "valoper"),
      bech32PrefixValPub: "".concat(r, "valoperpub"),
      bech32PrefixConsAddr: "".concat(r, "valcons"),
      bech32PrefixConsPub: "".concat(r, "valconspub"),
    },
    currencies: [
      {
        coinDenom: "SEI",
        coinMinimalDenom: "usei",
        coinDecimals: 6,
      },
      {
        coinDenom: "USDC",
        coinMinimalDenom: "usdc",
        coinDecimals: 6,
        coinGeckoId: "usd-coin",
        type: "cw20",
        contractAddress: "sei1eyfccmjm6732k7wp4p6gdjwhxjwsvje44j0hfx8nkgrm8fs7vqfsy2jxff",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "SEI",
        coinMinimalDenom: "usei",
        coinDecimals: 6,
      },
    ],
  };
  const add = () => {
    (window as unknown as KeplrWindow).keplr
      ?.experimentalSuggestChain(chainInfo)
      .then(() => {
        console.debug("add sei chain success!");
      })
      .catch(e => {
        console.log("error", e);
      });
  };
  return (
    <span
      className={classes.title}
      onClick={() => {
        add();
      }}
    >
      Add sei {chainId === "sei-devnet-1" ? "test" : "dev"} chain
    </span>
  );
};

export default AddSeiChain;
