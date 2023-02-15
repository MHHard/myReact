import React from "react";
import SimpleResModal from "../common/SimpleResModal";
import warning from "../../images/warning.svg";
import success from "../../images/success.svg";
import speedUp from "../../images/speedUp.svg";

export const HistorySpeedModal = ({ visible, onCancel, record, onSeedUp, loading }) => {
  const dstChain = record?.dst_received_info?.chain?.name;
  const message = (
    <span>
      {" "}
      cBridge is under heavy traffic and the transfer may taker longer time to complete. If you want to receive your
      funds sooner, you may speed up this transfer by{" "}
      <span style={{ color: "#FFAA00" }}>submitting the relay tx on {dstChain} yourself</span>. You will need to pay the
      gas fee for the relay tx.
    </span>
  );
  const btnText = "Speed up the transfer";
  const icon = <img src={speedUp} height="90px" alt="warning" />;
  const handleSubmit = () => onSeedUp(record);
  return (
    <SimpleResModal
      icon={icon}
      message={message}
      btnText={btnText}
      onClose={onCancel}
      onSubmit={handleSubmit}
      visible={visible}
      loading={loading}
    />
  );
};

export const HistoryDisConnectModal = ({ visible, onCancel, record, onSwitchChain, loading }) => {
  const dstChain = record?.dst_received_info?.chain?.name;
  const message = (
    <span>
      Please switch to <span style={{ color: "#FFAA00" }}>{dstChain}</span> before speeding up this transfer
    </span>
  );
  const icon = <img src={warning} height="90px" alt="success" />;
  const btnText = `Switch to ${dstChain}`;
  const handleSubmit = () => onSwitchChain(record.dst_received_info.chain.id);

  return (
    <SimpleResModal
      icon={icon}
      message={message}
      btnText={btnText}
      onClose={onCancel}
      onSubmit={handleSubmit}
      visible={visible}
      loading={loading}
    />
  );
};

export const HistorySpeedSuccessModal = ({ visible, onCancel, txHash }) => {
  //   const dstChain = record?.dst_received_info?.chain?.name;
  const message = `Speed up tx has been submitted. Please wait for a few minutes for the tx to complete.`;
  const textTitle = "Transfer Submitted";
  const icon = <img src={success} height="90px" alt="success" />;
  const btnText = `Done`;
  const handleSubmit = () => onCancel();
  return (
    <SimpleResModal
      icon={icon}
      txHash={txHash}
      titleText={textTitle}
      message={message}
      btnText={btnText}
      onClose={onCancel}
      onSubmit={handleSubmit}
      visible={visible}
    />
  );
};
