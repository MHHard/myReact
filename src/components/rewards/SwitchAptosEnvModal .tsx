import { Modal, Button } from "antd";
import { ButtonType } from "antd/lib/button";
import { createUseStyles } from "react-jss";
import { WarningFilled } from "@ant-design/icons";
import { Theme } from "../../theme";
import { storageConstants } from "../../constants/const";
import { NonEVMMode, useNonEVMContext } from "../../providers/NonEVMContextProvider";

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

export interface SwitchAptosEnvModalProps {
  showModal: boolean;
  claimTitle: string;
  onClose: () => void;
}
export default function SwitchWalletEnvModal({ claimTitle, onClose }: SwitchAptosEnvModalProps): JSX.Element {
  const classes = useStyles();
  const { nonEVMMode } = useNonEVMContext();
  const closeModal = () => {
    onClose();
  };

  const buttonType: ButtonType = "primary";
  const getwalletText = () => {
    let text = "aptos";
    switch (nonEVMMode) {
      case NonEVMMode.aptosMainnet:
      case NonEVMMode.aptosTest:
      case NonEVMMode.aptosDevnet: {
        text = "aptos";
        break;
      }
      case NonEVMMode.seiMainnet:
      case NonEVMMode.seiDevnet:
      case NonEVMMode.seiTestnet: {
        text = "sei";
        break;
      }
      case NonEVMMode.injectiveTestnet:
      case NonEVMMode.injectiveMainnet: {
        text = "inj";
        break;
      }
      default:
        break;
    }
  };
  const content = (
    <div>
      <div style={{ textAlign: "center" }}>
        <WarningFilled style={{ fontSize: 50, color: "#ffaa00", marginTop: 40 }} />
      </div>
      <div className={classes.modaldes}>
        Please switch your {getwalletText()} wallet to{" "}
        <span style={{ fontSize: 20, color: "#FFAA00" }}>{process.env.REACT_APP_APTOS_NET}</span> through{" "}
        {localStorage.getItem(storageConstants.KEY_APTOS_CONNECTED_WALLET_NAME)?.toLowerCase()} wallet settings and
        reload page
      </div>
      <Button
        type={buttonType}
        size="large"
        block
        onClick={() => {
          closeModal();
        }}
        className={classes.button}
      >
        Got it
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
