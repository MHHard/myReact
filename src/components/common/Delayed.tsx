import { FC, useState, useEffect } from "react";

interface IProps {
  waitBeforeShow?: number;
}

const Delayed: FC<IProps> = props => {
  const { waitBeforeShow, children } = props;
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsShown(true), waitBeforeShow);
  }, [waitBeforeShow]);

  return isShown ? <>{children}</> : null;
};

export default Delayed;

Delayed.defaultProps = {
  waitBeforeShow: 500,
};
