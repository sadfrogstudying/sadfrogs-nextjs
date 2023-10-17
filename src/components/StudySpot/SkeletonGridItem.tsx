import { Card, CardContent, CardHeader } from "~/components/UI/Card";
import { Skeleton } from "~/components/UI/Skeleton";

const SkeletonImage = ({ className = "" }: { className?: string }) => (
  <Skeleton
    className={`aspect-[3/4] w-full bg-gray-200 rounded-md flex justify-center items-center ${className}`}
  >
    Loading Spot...
  </Skeleton>
);
const SkeletonText = ({ className = "" }: { className?: string }) => (
  <Skeleton className={`bg-gray-200 h-4 rounded-md ${className}`} />
);
const SkeletonStudySpotGridItem = () => (
  <Card className="flex flex-col gap-4 border-0 shadow-none w-full font-mono text-sm justify-start">
    <CardHeader className="p-0 w-full">
      <SkeletonImage />
    </CardHeader>
    <CardContent className="p-0 w-29 flex flex-col space-y-2.5 py-2">
      <SkeletonText className="h-4" />
      <SkeletonText className="h-4" />
      <SkeletonText className="h-4" />
      <SkeletonText className="h-4" />
    </CardContent>
  </Card>
);

export { SkeletonStudySpotGridItem };
