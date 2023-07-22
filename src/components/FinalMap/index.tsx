import dynamic from "next/dynamic";
import { Skeleton } from "../UI/Skeleton";

/** New pattern, where I re-export the dynamic component from index.tsx */
const FinalMap = dynamic(
  () => import("~/components/FinalMap/FinalDynamicMap"),
  {
    loading: () => (
      <Skeleton
        className="w-full mb-4 rounded-md overflow-hidden border border-gray-200 flex justify-center items-center font-mono bg-gray-300"
        style={{ height: `500px` }}
      >
        Loading Map...
      </Skeleton>
    ),
    ssr: false,
  }
);

export default FinalMap;