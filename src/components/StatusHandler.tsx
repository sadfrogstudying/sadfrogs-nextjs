import type { FetchStatus, QueryStatus } from "@tanstack/react-query";
import { SkeletonStudySpotGridItem } from "./UI/SkeletonV1";

const StatusHandler = ({
  status,
  children,
}: {
  status: QueryStatus;
  children: React.ReactNode;
}) => {
  return (
    <>
      {status === "loading" ? (
        <>
          <SkeletonStudySpotGridItem />
          <SkeletonStudySpotGridItem />
          <SkeletonStudySpotGridItem />
          <SkeletonStudySpotGridItem />
        </>
      ) : (
        children
      )}
    </>
  );
};

export default StatusHandler;
