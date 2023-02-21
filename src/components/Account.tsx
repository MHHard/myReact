import { Dropdown, Menu, Typography } from "antd";
import { useCallback, useContext, useState } from "react";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { useAppDispatch } from "../redux/store";
import { ModalName, openModal } from "../redux/modalSlice";
import { ColorThemeContext } from "../providers/ThemeProvider";
import defaultIcon from "../images/tokenNoIcon.svg";
import logout from "../images/logout.png";

export default function Account(): JSX.Element {
  const { isMobile } = useContext(ColorThemeContext);
  const { address, web3Modal, logoutOfWeb3Modal } = useWeb3Context();
  const dispatch = useAppDispatch();
  const [menuVisible, setMenuVisible] = useState(false);

  const showProviderModal = useCallback(() => {
    dispatch(openModal(ModalName.provider));
  }, [dispatch]);

  if (web3Modal.cachedProvider !== "") {
    const menu = (
      <Menu className="disconnectDropDown">
        <Menu.Item
          key="logout"
          onClick={() => {
            logoutOfWeb3Modal();
            setMenuVisible(false);
          }}
        >
          <div className="disconnect">
            <img src={logout} alt="" className="logoOutIcon" />
            Disconnect
          </div>
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown
        overlay={menu}
        trigger={["click"]}
        onVisibleChange={(visible) => {
          setMenuVisible(visible);
        }}
      >
        <div className={menuVisible ? "account accountOpen" : "account"}>
          <img style={{ marginRight: 0 }} alt="Icon" src={defaultIcon} />
          <Typography.Text
            className="addressText"
            ellipsis={{ suffix: address.slice(isMobile ? -2 : -4) }}
          >
            {address}
          </Typography.Text>
        </div>
      </Dropdown>
    );
  }

  return (
    <>
      <div className="connectWalletBtn" onClick={showProviderModal}>
        Connect Wallet
      </div>
    </>
  );
}
