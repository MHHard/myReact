import { Button } from "antd";
import Modal from "antd/lib/modal/Modal";
import { createUseStyles } from "react-jss";
import { useDispatch } from "react-redux";
import { Theme } from "../../theme";
import { useAppSelector } from "../../redux/store";
import { closeModal, ModalName } from "../../redux/modalSlice";
import warning from "../../images/warning.svg";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  modal: {
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
    },
  },
  blockModaldes: {
    color: theme.surfacePrimary,
    marginTop: props => (props.isMobile ? 34 : 58),
    fontSize: 14,
    textAlign: "center",
    fontWeight: 500,
  },
  blockButton: {
    marginTop: props => (props.isMobile ? 16 : 40),
    height: 56,
    lineHeight: "42px",
    background: theme.primaryBrand,
    border: 0,
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
  support: {
    color: theme.primaryBrand,
    cursor: "pointer",
  },
}));

export default function UserIsBlockedModal(): JSX.Element {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const dispatch = useDispatch();
  const onClose = () => {
    dispatch(closeModal(ModalName.userIsBlocked));
  };
  return (
    <Modal closable visible width={512} title={null} onCancel={onClose} footer={null} className={classes.modal}>
      <div>
        <div style={{ textAlign: "center", marginTop: 100 }}>
          <img src={warning} height="90px" alt="" />
        </div>
        <div className={classes.blockModaldes}>
          Your access to cBridge UI is blocked due to potential high risk activity. If you believe this categorization
          is wrong, please reach out to our{" "}
          <span
            className={classes.support}
            onClick={() => {
              window.open("https://form.typeform.com/to/Q4LMjUaK", "_blank");
            }}
          >
            support team
          </span>
          .
        </div>
        <Button
          type="primary"
          size="large"
          block
          onClick={() => {
            onClose();
          }}
          className={classes.blockButton}
        >
          OK
        </Button>
      </div>
    </Modal>
  );
}
