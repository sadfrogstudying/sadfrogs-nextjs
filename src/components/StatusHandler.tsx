import type { QueryStatus } from "@tanstack/react-query";
import { SkeletonStudySpotGridItem } from "./StudySpot/SkeletonGridItem";

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
