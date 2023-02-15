import { WarningFilled } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { createUseStyles } from "react-jss";
import { useAppSelector } from "../../redux/store";
import { Theme } from "../../theme";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  modalTop: {},
  modalTopDes: {
    fontSize: 14,
  },
  modalTopIcon: {
    fontSize: 16,
    fontWeight: 600,
    width: "100%",
    textAlign: "center",
    marginTop: 40,
    marginBottom: props => (props.isMobile ? 0 : 45),
    color: theme.transferSuccess,
  },
  modalDesc: {
    color: theme.surfacePrimary,
    marginTop: props => (props.isMobile ? 15 : 40),
    fontSize: 14,
    fontWeight: 400,
    textAlign: "center",
  },
  button: {
    marginTop: props => (props.isMobile ? 16 : 40),
    height: 56,
    width: "100%",
    lineHeight: "42px",
    background: theme.primaryBrand,
    borderRadius: 16,
    border: "none",
    fontSize: 16,
    fontWeight: 700,
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
  modal: {
    width: "100%",
    minWidth: props => (props.isMobile ? "100%" : 500),
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
        padding: props => (props.isMobile ? "16px" : ""),
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

export interface RegionRestrictModalProps {
  showModal: boolean;
  onClose: () => void;
}

export function RegionRestrictModal({ showModal, onClose }: RegionRestrictModalProps) {
  const { windowWidth } = useAppSelector(state => state);
  const { isMobile } = windowWidth;
  const classes = useStyles({ isMobile });

  return (
    <Modal width={512} open={showModal} footer={null} className={classes.modal} onCancel={onClose}>
      <>
        <div className={classes.modalTop}>
          <div className={classes.modalTopIcon}>
            <WarningFilled style={{ fontSize: 65, marginRight: 5, color: "#FFAA00" }} />
          </div>
          <div className={classes.modalDesc}>
            <span className={classes.greenText}>Adding liquidity is not supported for your region.</span>
          </div>

          <Button size="large" className={classes.button} type="primary" onClick={onClose}>
            Got it
          </Button>
        </div>
      </>
    </Modal>
  );
}
