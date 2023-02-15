import { Modal, Button } from "antd";
import { ButtonType } from "antd/lib/button";
import { createUseStyles } from "react-jss";
import { WarningFilled } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Theme } from "../../theme";
import { switchChain, setFromChain } from "../../redux/transferSlice";
import { getNetworkById } from "../../constants/network";

/* eslint-disable */
const useStyles = createUseStyles((theme: Theme) => ({
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    marginTop: 40,
    height: 56,
    lineHeight: "42px",
    background: theme.primaryBrand,
    borderRadius: 16,
    fontSize: 18,
    fontWeight: 700,
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
  modaldes: {
    color: theme.surfacePrimary,
    marginTop: 40,
    fontSize: 15,
    textAlign: "center",
  },
  modaldes2: {
    color: theme.surfacePrimary,
    marginTop: 30,
    fontSize: 18,
    textAlign: "center",
  },
  unlockModal: {
    border: `1px solid ${theme.primaryBackground}`,
    "& .ant-modal-content": {
      background: theme.secondBackground,
      "& .ant-modal-close": {
        color: theme.surfacePrimary,
      },
      "& .ant-modal-header": {
        background: theme.secondBackground,
        borderBottom: "none",
        "& .ant-modal-title": {
          color: theme.surfacePrimary,
          "& .ant-typography": {
            color: theme.surfacePrimary,
          },
        },
      },
      "& .ant-modal-body": {
        minHeight: 260,
      },
      "& .ant-modal-footer": {
        border: "none",
        "& .ant-btn-link": {
          color: theme.primaryBrand,
        },
      },
    },
    "& .ant-typography": {
      color: theme.surfacePrimary,
    },
  },
}));

/* eslint-disable */

export interface SwitchChainModalProps {
  showModal: boolean;
  claimTitle: string;
  onClose: () => void;
}
export default function SwitchChainModal({ claimTitle, onClose }: SwitchChainModalProps): JSX.Element {
  const classes = useStyles();
  const { windowWidth, transferInfo } = useAppSelector(state => state);
  const { isMobile } = windowWidth;
  const { transferConfig } = transferInfo;
  const dispatch = useAppDispatch();

  const closeModal = () => {
    onClose();
  };

  const buttonType: ButtonType = "primary";
  const id = process.env.REACT_APP_ENV === "MAINNET" ? process.env.REACT_APP_OPTIMISM_ID : process.env.REACT_APP_BSC_ID;
  const name = process.env.REACT_APP_ENV === "MAINNET" ? 'Optimism' : 'BSC Testnet';
  const content = (
    <div>
      <div style={{ textAlign: "center" }}>
        <WarningFilled style={{ fontSize: 50, color: "#ffaa00", marginTop: 40 }} />
      </div>
      <div className={classes.modaldes}>
        Please switch to {getNetworkById(Number(id)).name} to claim the {claimTitle}
      </div>
      <Button
        type={buttonType}
        size="large"
        block
        onClick={() => {
          if (!isMobile) {
            switchChain(Number(id), "", (chainId: number) => {
              const chain = transferConfig.chains.find(chainInfo => {
                return chainInfo.id === chainId;
              });
              if (chain !== undefined) {
                dispatch(setFromChain(chain));
              }
            });
          } else {
            closeModal();
          }
        }}
        className={classes.button}
      >
        Switch to {name}
      </Button>
    </div>
  );
  const titleText = " ";

  return (
    <Modal title={titleText} width={512} onCancel={closeModal} visible footer={null} className={classes.unlockModal}>
      {content}
    </Modal>
  );
}
