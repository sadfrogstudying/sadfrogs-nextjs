import type { FetchStatus, QueryStatus } from "@tanstack/react-query";
import { StudySpotGridItemSkeleton } from "./UI/Skeleton";

const StatusHandler = ({
  status,
  fetchStatus,
  children,
}: {
  status: QueryStatus;
  fetchStatus: FetchStatus;
  children: React.ReactNode;
}) => {
  console.log(fetchStatus);

  return (
    <>
      {status === "loading" ? (
        <>
          <StudySpotGridItemSkeleton />
          <StudySpotGridItemSkeleton />
          <StudySpotGridItemSkeleton />
          <StudySpotGridItemSkeleton />
        </>
      ) : (
        children
      )}
    </>
  );
};

export default StatusHandler;
