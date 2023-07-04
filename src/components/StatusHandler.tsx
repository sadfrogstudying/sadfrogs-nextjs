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

const SadPepe = () => {
  return (
    <video autoPlay playsInline muted loop>
      <source src="/sad-pepe.mp4" />
      <meta itemProp="description" content="Sad Frog" />
    </video>
  );
};
