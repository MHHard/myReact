import announcementIcon from "../images/announcementIcon.svg";

export default function Announcement(): JSX.Element {
  const text =
    "ChainHop service is temporarily paused for the Ethereum merge. The service will resume shortly after the merge is done.";
  return (
    <div className="announcement">
      <img
        className="announcementIcon"
        src={announcementIcon}
        alt="announcementIcon"
      />
      <div className="announcementText">{text}</div>
    </div>
  );
}
