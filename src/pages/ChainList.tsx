/* eslint-disable camelcase */
import { List, Input, Modal } from "antd";
import { FC, useState, useEffect } from "react";
import { useAppSelector } from "../redux/store";
import { CHAIN_LIST } from "../constants/network";
import { useTransferSupportedChainList } from "../hooks/transferSupportedInfoList";
import { sortedChainNames } from "../constants/sortedChain";
import { Chain } from "../proto/chainhop/common_pb";

interface IProps {
  visible: boolean;
  onSelectChain: (tokenId: number) => void;
  onCancel: () => void;
}

const ChainList: FC<IProps> = ({ visible, onSelectChain, onCancel }) => {
  const { transferInfo } = useAppSelector((state) => state);
  const { chainSource, transferConfig, fromChain, toChain } = transferInfo;
  const { chains } = transferConfig;
  const [chainArr, setChainArr] = useState(chains);
  const [searchText, setSearchText] = useState("");
  const transferSupportedChainList = useTransferSupportedChainList(
    chainSource === "to"
  );

  const getTitle = () => {
    let title;
    switch (chainSource) {
      case "from":
        title = "Select a chain";
        break;
      case "to":
        title = "Select a chain";
        break;

      default:
        break;
    }
    return title;
  };

  const getChainId = () => {
    let chainModalId;
    switch (chainSource) {
      case "from":
        chainModalId = fromChain?.chainId;
        break;
      case "to":
        chainModalId = toChain?.chainId;
        break;
      default:
        break;
    }
    return chainModalId;
  };

  const onInputChange = (e) => {
    setSearchText(e.target.value?.toLowerCase());
  };
  const onEnter = (e) => {
    setSearchText(e.target.value?.toLowerCase());
  };

  const sortChainList = (chainList: Chain.AsObject[]) => {
    const normalChainList: Chain.AsObject[] = [];
    const otherChainList: Chain.AsObject[] = [];

    chainList.forEach((chain) => {
      if (
        sortedChainNames.find((chainName) => chain.name.includes(chainName))
      ) {
        normalChainList.push(chain);
      } else {
        otherChainList.push(chain);
      }
    });

    // sort normal chain
    const sortedNormalChainList: Chain.AsObject[] = [];
    sortedChainNames.forEach((chainName) => {
      const targetNormalChain = normalChainList.find((chain) =>
        chain.name.includes(chainName)
      );
      if (targetNormalChain) {
        sortedNormalChainList.push(targetNormalChain);
      }
    });

    // sort other chain
    const sortedOtherChainList: Chain.AsObject[] = otherChainList.sort(
      (a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      }
    );
    const result = sortedNormalChainList.concat(
      sortedOtherChainList
    ) as Array<Chain.AsObject>;
    return result;
  };
  useEffect(() => {
    const localChainIdWhiteList = CHAIN_LIST.map((networkInfo) => {
      return networkInfo.chainId;
    });
    const list = transferSupportedChainList.filter((chain) => {
      return (
        (chain.name.toLocaleLowerCase().indexOf(searchText) > -1 ||
          chain.chainId.toString().toLowerCase().indexOf(searchText) > -1) &&
        localChainIdWhiteList.includes(chain.chainId)
      );
    });
    setChainArr(sortChainList(list));
  }, [transferSupportedChainList, searchText, visible]);
  const renderChainItem = (chain: Chain.AsObject) => {
    return (
      <div
        className={getChainId() === chain.chainId ? "activeItem" : "item"}
        onClick={() => onSelectChain(chain.chainId)}
      >
        <div className="litem">
          <div className="itemLeft">
            <img src={chain.icon} alt="" />
            <div style={{ marginLeft: 24 }}>
              <div id="chainName" className="tokenName">
                {chain.name}
              </div>
            </div>
          </div>
          {getChainId() === chain.chainId && (
            <div className="dot" />
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal
      className="chainModal"
      onCancel={() => onCancel()}
      visible={visible}
      footer={null}
      maskClosable={false}
      title={getTitle()}
      width={512}
      destroyOnClose
      centered
      maskStyle={{ opacity: 0.6 }}
    >
      <div>
        {/* <div>
          <Input
            className="searchinput"
            placeholder="Search chain by name or chain ID"
            onChange={onInputChange}
            onPressEnter={onEnter}
            allowClear
          />
        </div> */}
        {/* {chainSource === "to" && (
          <div className="tips">
            <div className="tipsLeft">Tips:</div>
            <div className="tipsRight">
              Below shows the destination chains that have an available route
              from {fromChain?.name}. More chains can be found if you select
              other source chains.
            </div>
          </div>
        )} */}

        <div className="chainModalContent">
          {chainArr.length > 0 ? (
            <List
              itemLayout="horizontal"
              grid={{
                gutter: 16,
                column: 1,
              }}
              size="small"
              dataSource={chainArr}
              renderItem={renderChainItem}
              locale={{ emptyText: "No results found." }}
            />
          ) : (
            <div>
              <div
                style={{
                  width: "100%",
                  fontSize: 16,
                  textAlign: "center",
                }}
                className="noResult"
              >
                No results found.
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ChainList;
