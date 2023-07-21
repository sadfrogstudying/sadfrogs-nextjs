import { Skeleton } from "~/components/UI/Skeleton";

const FullWidthCarouselSkeleton = () => {
  return (
    <div className="w-full h-fit p-4">
      <Skeleton>
        <div className="flex touch-pan-y h-96 gap-2">
          <div className="relative w-fit h-full rounded-md overflow-hidden"></div>
        </div>
      </Skeleton>

      <Skeleton className="mt-2">
        <div className="flex touch-pan-y h-24 gap-2"></div>
      </Skeleton>
    </div>
  );
};

export default FullWidthCarouselSkeleton;
