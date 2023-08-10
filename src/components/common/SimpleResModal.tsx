import { Modal, Button } from "antd";
import { createUseStyles } from "react-jss";
import { Theme } from "../../theme";
import { useAppSelector } from "../../redux/store";
import { useWeb3Context } from "../../providers/Web3ContextProvider";

export interface SimpleResModalProps {
  icon: JSX.Element;
  message: JSX.Element | string;
  btnText?: string;
  visible?: boolean;
  loading?: boolean;
  titleText?: string;
  txHash?: string;
  onClose: () => void;
  onSubmit: () => void;
}

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  simpleModal: {
    minWidth: props => (props.isMobile ? "100%" : 448),
    background: theme.secondBackground,
    border: `1px solid ${theme.primaryBackground}`,
    "& .ant-modal-content": {
      background: theme.secondBackground,
      boxShadow: props => (props.isMobile ? "none" : ""),
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
  modalTopIcon: {
    fontSize: 16,
    fontWeight: 600,
    width: "100%",
    textAlign: "center",
    marginTop: props => (props.isMobile ? 18 : 40),
    marginBottom: props => (props.isMobile ? 18 : 40),
    "&img": {
      width: 90,
    },
  },
  titleText: {
    color: theme.surfacePrimary,
    marginTop: 40,
    fontSize: 16,
    textAlign: "center",
    margin: "0px 20px 10px 20px ",
    fontWeight: 600,
  },
  noteview: {
    color: theme.primaryBrand,
    textAlign: "center",
    margin: "18px 0",
    cursor: "pointer",
  },
  descMessage: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.surfacePrimary,
    textAlign: "center",
    margin: "25px 0 0 0 ",
  },
  button: {
    marginTop: props => (props.isMobile ? 16 : 40),
    height: 56,
    lineHeight: "42px",
    background: theme.primaryBrand,
    borderRadius: 16,
    fontSize: 18,
    fontWeight: 500,
    borderWidth: 0,
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
}));

export default function SimpleResModal(props: SimpleResModalProps) {
  const { chainId, getNetworkById } = useWeb3Context();
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const { loading, visible, icon, titleText, txHash, message, btnText, onClose, onSubmit } = props;

  const handleClick = () => {
    onSubmit();
  };

  const content = (
    <div>
      <div className={classes.modalTopIcon} style={{ marginTop: 80 }}>
        {icon}
      </div>
      {titleText && <div className={classes.titleText}>{titleText}</div>}
      <div className={classes.descMessage}>{message}</div>
      {txHash && (
        <div className={classes.noteview}>
          <a href={getNetworkById(chainId).blockExplorerUrl + "/tx/" + txHash} target="_blank" rel="noreferrer">
            View in Explorer
          </a>
        </div>
      )}
      <Button type="primary" size="large" loading={loading} block onClick={handleClick} className={classes.button}>
        {btnText}
      </Button>
    </div>
  );

  return (
    <Modal
      // title={title}
      width={512}
      onCancel={onClose}
      visible={visible}
      footer={null}
      className={classes.simpleModal}
    >
      {content}
    </Modal>
  );
}

SimpleResModal.defaultProps = {
  titleText: "",
  txHash: "",
  btnText: "Done",
  visible: false,
  loading: false,
};
