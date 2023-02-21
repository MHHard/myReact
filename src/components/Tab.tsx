import { useContext, useState } from "react";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { ColorThemeContext } from "../providers/ThemeProvider";
import { getNetworkById } from "../constants/network";

interface TabState {
  selectedKey: string;
  keyList: string[];
  onSelect: (val) => void;
}

export default function Tab(data: TabState): JSX.Element {
  const { selectedKey, onSelect, keyList } = data;
  const { isMobile } = useContext(ColorThemeContext);
  const { chainId, network, web3Modal } = useWeb3Context();
  const [tabKey, setTabKey] = useState(selectedKey);

  const setKey = (val) => {
    setTabKey(val);
    onSelect(val);
  };

  return (
    <div className="myTab">
      {keyList?.map((item) => {
        return (
          <div
            key={item}
            className={tabKey === item ? "myTabItemActive" : "myTabItem"}
            onClick={() => {
              setKey(item);
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}
