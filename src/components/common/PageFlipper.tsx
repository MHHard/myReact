import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FC, useEffect, useState } from "react";

interface IProps {
  page: number; // 0 based
  hasMore: boolean;
  onPageChange: (page: number) => void;
}

const PageFlipper: FC<IProps> = (props) => {
  const { page, hasMore, onPageChange } = props;

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
    <div className="pageFlipper">
      <Button
        className="pageBtn"
        icon={<LeftOutlined className="pageIcon" />}
        disabled={page === 0}
        onClick={() => handlePageChange(page - 1)}
      />
      <div className="pageNumber">{page + 1}</div>
      <Button
        className="pageBtn"
        icon={<RightOutlined className="pageIcon" />}
        onClick={() => handlePageChange(page + 1)}
        disabled={!hasMore}
      />
    </div>
  );
};

export default PageFlipper;
