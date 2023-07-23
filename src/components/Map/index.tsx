import dynamic from "next/dynamic";
import { Skeleton } from "../UI/Skeleton";

/**
 * New pattern, where I re-export the dynamic component from index.tsx
 * The benefit is cleaner import
 */
const FinalMap = dynamic(() => import("~/components/Map/DynamicMap"), {
  loading: () => (
    <Skeleton className="w-full h-96 mb-4 rounded-md overflow-hidden border border-gray-200 flex justify-center items-center font-mono bg-gray-300">
      Loading Map...
    </Skeleton>
  ),
  ssr: false,
});

export default FinalMap;
