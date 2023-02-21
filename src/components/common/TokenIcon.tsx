import { Image } from "antd";
import tokenNoIcon from "../../images/tokenNoIcon.svg";

interface TokenIconState {
  className?: string;
  src?: string;
}
export default function TokenIcon(data: TokenIconState): JSX.Element {
  const { className, src } = data;
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        src={src}
        style={{ borderRadius: "50%", display: 'flex' }}
        fallback={tokenNoIcon}
        preview={false}
      />
    </div>
  );
}
