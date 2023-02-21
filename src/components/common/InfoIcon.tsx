import iconInfoBlack from "../../images/infoIconBlack.svg";
import iconInfoGray from "../../images/infoIconGray.svg";
import iconInfoWarn from "../../images/infoIconWarn.svg";
import iconInfoGreen from "../../images/infoIconGreen.svg";
import infoIconWhite from "../../images/infoIconWhite.svg";

interface InfoIconState {
  className?: string;
  color?: "black" | "gray" | "warn" | "green" | "white";
}
export default function InfoIcon(data: InfoIconState): JSX.Element {
  const { className, color = "black" } = data;
  const getIcon = () => {
    let iconSrc = iconInfoBlack;
    switch (color) {
      case "black":
        iconSrc = iconInfoBlack;
        break;
      case "gray":
        iconSrc = iconInfoGray;
        break;
      case "warn":
        iconSrc = iconInfoWarn;
        break;
      case "green":
        iconSrc = iconInfoGreen;
        break;
      case "white":
        iconSrc = infoIconWhite;
        break;
      default:
        break;
    }
    return iconSrc;
  };
  return (
    <span
      className={className}
      style={{
        display: "flex",
      }}
    >
      <img src={getIcon()} alt="" style={{ width: "100%" }} />
    </span>
  );
}
