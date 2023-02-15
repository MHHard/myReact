import { createUseStyles } from "react-jss";
import { useAppSelector } from "../../redux/store";
import { Theme } from "../../theme";
import tipIcon from "../../images/bell.svg";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  headerTip: {
    width: "100%",
    height: 48,
    fontSize: 14,
    color: theme.surfacePrimary,
    fontWeight: 500,
    position: "relative",
    borderBottom: `0.5px solid ${theme.primaryBorder}`,
  },

  tipContent: {
    textAlign: "center",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    msTransform: "translateY(-50%)",
    // color: "white",
    color: theme.surfacePrimary,
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },

  headerTipMobile: {
    width: "100%",
    height: 130,
    fontSize: 14,
    color: theme.surfacePrimary,
    fontWeight: 500,
    position: "relative",
    borderBottom: `0.5px solid ${theme.primaryBorder}`,
  },
}));

type IProps = {
  systemAnnouncement: string;
};

function SystemNotificationView({ systemAnnouncement }: IProps): JSX.Element {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });

  if (isMobile) {
    return (
      <div className={classes.headerTipMobile}>
        <div className={classes.tipContent}>
          <img src={tipIcon} alt="tooltip icon" />
          <div style={{ width: "10px" }} />
          <div>
            {systemAnnouncement}
            {/* cBridge is currently under scheduled maintenance. The service is expected to resume after 2022-07-06
            05:00:00 UTC. Thanks for your patience. */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.headerTip}>
      <div className={classes.tipContent}>
        <img src={tipIcon} alt="tooltip icon" />
        <div style={{ width: "10px" }} />
        <div>
          {systemAnnouncement}
          {/* cBridge is currently under scheduled maintenance. The service is expected to resume after 2022-07-06 05:00:00
          UTC. Thanks for your patience. */}
        </div>
      </div>
    </div>
  );
}

type IPropsForHtml = {
    // eslint-disable-next-line
    privateAnnouncement: any;
};

export function PrivateNotificationView({ privateAnnouncement }: IPropsForHtml): JSX.Element {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });

  if (isMobile) {
    return (
      <div className={classes.headerTipMobile}>
        <div className={classes.tipContent}>
          <img src={tipIcon} alt="tooltip icon" />
          <div style={{ width: "10px" }} />
          <div>
            {privateAnnouncement}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.headerTip}>
      <div className={classes.tipContent}>
        <img src={tipIcon} alt="tooltip icon" />
        <div style={{ width: "10px" }} />
        <div>
          {privateAnnouncement}
        </div>
      </div>
    </div>
  );
}


export default SystemNotificationView;
