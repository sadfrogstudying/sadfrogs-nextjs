import { Card, CardContent, CardHeader } from "~/components/UI/Card";
import { Skeleton } from "~/components/UI/Skeleton";

const SkeletonImage = ({ className = "" }: { className?: string }) => (
  <Skeleton
    className={`aspect-[2/3] w-full bg-gray-200 rounded-md flex justify-center items-center ${className}`}
  >
    Loading Spot...
  </Skeleton>
);
const SkeletonText = ({ className = "" }: { className?: string }) => (
  <Skeleton className={`bg-gray-200 h-4 rounded-md ${className}`} />
);
const SkeletonStudySpotGridItem = () => (
  <Card className="flex flex-col gap-4 border-0 shadow-none w-full font-mono text-sm justify-end">
    <CardHeader className="p-0 w-full">
      <SkeletonImage />
    </CardHeader>
    <CardContent className="space-y-4 p-0 w-29 py-4 flex flex-col">
      <SkeletonText className="h-3.5 w-2/5" />
      <div className="space-y-2">
        <SkeletonText className="h-3.5" />
        <SkeletonText className="h-3.5" />
        <SkeletonText className="h-3.5" />
        <SkeletonText className="h-3.5" />
      </div>

      <div className="space-y-2">
        <div className="flex gap-2 items-start">
          <SkeletonText className="w-28 h-3.5 shrink-0 min-w-max" />
          <SkeletonText className="w-20 h-3.5" />
        </div>
        <div className="flex gap-2 items-start">
          <SkeletonText className="w-28 h-3.5 shrink-0 min-w-max" />
          <SkeletonText className="w-20 h-3.5" />
        </div>
        <div className="flex gap-2 items-start">
          <SkeletonText className="w-28 h-3.5 shrink-0 min-w-max" />
          <SkeletonText className="w-20 h-3.5" />
        </div>
      </div>
      <Skeleton className="bg-gray-200 h-7 w-full rounded-md" />
    </CardContent>
  </Card>
);

export { SkeletonStudySpotGridItem };
