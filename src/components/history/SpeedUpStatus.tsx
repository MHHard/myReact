import { Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { createUseStyles } from "react-jss";
import { Theme } from "../../theme";
import { useAppSelector } from "../../redux/store";

const mobileStyles = createUseStyles((theme: Theme) => ({
    supportText: {
        display: "inline-block",
        cursor: "pointer",
        color: theme.primaryReduce,
        marginLeft: "8px"
    },
    centerFlex: {
        display: "flex",
        alignItems: "center",
    }, 
    blueText: {
        color: theme.primaryReduce,
    },
    mobileTooltipOverlayStyle: {
        "& .ant-tooltip-inner": {
            width: "calc(100vw - 40px)",
            borderRadius: 8,
          },
          "& .ant-tooltip-arrow-content": {
            width: 9,
            height: 9,
          },
    }
}))

const SpeedUpStatus = (props) => {
    const styles = mobileStyles();
    const { item, peggedMode, onSpeedUp } = props;
    const { isMobile } = useAppSelector(state => state.windowWidth);

    const content = (
        <div className={styles.centerFlex}>
            <div className={styles.blueText}>Speed Up This Transfer</div>
            <Tooltip
                overlayClassName={isMobile ? styles.mobileTooltipOverlayStyle : undefined}
                title={
                    <span>
                        cBridge is under heavy traffic and the transfer may taker longer time to complete. If you want to receive
                        your funds sooner, you may speed up this transfer by{" "}
                        <span style={{ fontWeight: "bold" }}>
                        submitting the relay tx on {item.dst_received_info.chain.name} yourself.
                        </span>{" "}
                        You will need to pay the gas fee for the relay tx.
                    </span>
                }
                placement={isMobile ? "bottomLeft" : "bottom"}
                color="#fff"
                overlayInnerStyle={{ color: "#000" }}
            >
                <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
            </Tooltip>
        </div>
    )

    return (
        <div className={styles.supportText} onClick={() => onSpeedUp(item, peggedMode)}>
           {content}
        </div>
    )
}

export default SpeedUpStatus;