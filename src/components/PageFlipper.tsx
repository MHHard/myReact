import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FC, useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { useAppSelector } from "../redux/store";
import { Theme } from "../theme";

interface IProps {
  page: number; // 0 based
  hasMore: boolean;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
  },
  page: {
    padding: 12,
    color: theme.surfacePrimary,
  },
  icon: {
    fontSize: 13,
    color: theme.surfaceUnable,
  },
  btn: {
    background: `${theme.secondBackground} !important`,
    borderRadius: "4px !important",
    border: `1px solid ${theme.secondBrand} !important`,
    "& .anticon": {
      color: theme.secondBrand,
    },
  },
  disabledBtn: {
    background: `${theme.secondBackground} !important`,
    borderRadius: "4px !important",
    border: `1px solid ${theme.surfaceUnable} !important`,
    "& .anticon": {
      color: theme.surfaceUnable,
    },
  },
  pageNum: {
    background: `${theme.secondBackground} !important`,
    borderRadius: "4px !important",
    border: `1px solid ${theme.secondBrand} !important`,
    color: theme.surfacePrimary,
    width: 32,
    height: 32,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0px 8px",
  },
}));

const PageFlipper: FC<IProps> = props => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const { page, hasMore, isLoading, onPageChange } = props;
  const classes = useStyles({ isMobile });

  const [lastPage, setLastPage] = useState(-1);
  useEffect(() => {
    if (!hasMore && lastPage === -1) {
      setLastPage(page);
    }
  }, [hasMore, page, lastPage]);

  const handlePageChange = (toPage: number) => {
    if (toPage < 0) {
      return;
    }
    onPageChange(toPage);
  };
  return (
    <div className={classes.container}>
      <Button
        className={page === 0 || isLoading ? classes.disabledBtn : classes.btn}
        icon={<LeftOutlined className={classes.icon} />}
        disabled={page === 0 || isLoading}
        onClick={() => handlePageChange(page - 1)}
      />
      <div className={classes.pageNum}>{page + 1}</div>
      <Button
        className={!hasMore || isLoading ? classes.disabledBtn : classes.btn}
        icon={<RightOutlined className={classes.icon} />}
        onClick={() => handlePageChange(page + 1)}
        disabled={!hasMore || isLoading}
      />
    </div>
  );
};

export default PageFlipper;
