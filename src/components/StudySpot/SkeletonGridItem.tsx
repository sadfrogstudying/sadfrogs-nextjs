import { Card, CardContent, CardHeader } from "~/components/UI/Card";
import { Skeleton } from "~/components/UI/Skeleton";

const SkeletonImage = ({ className = "" }: { className?: string }) => (
  <Skeleton
    className={`aspect-[2/3] w-full bg-gray-300 rounded-md ${className}`}
  />
);
const SkeletonText = ({ className = "" }: { className?: string }) => (
  <Skeleton className={`bg-gray-300 h-4 rounded-md mb-2 ${className}`} />
);
const SkeletonStudySpotGridItem = () => (
  <Card>
    <CardHeader>
      <SkeletonImage />
    </CardHeader>
    <CardContent>
      <SkeletonText className="h-6 w-1/2" />
      <div>
        <div className="flex justify-between gap-2">
          <SkeletonText className="w-2/5" />
          <SkeletonText className="w-full" />
        </div>
        <div className="flex justify-between gap-2">
          <SkeletonText className="w-2/5" />
          <SkeletonText className="w-full" />
        </div>
        <div className="flex justify-between gap-2">
          <SkeletonText className="w-2/5" />
          <SkeletonText className="w-full" />
        </div>
      </div>
      <div>
        <SkeletonText />
        <SkeletonText />
        <SkeletonText />
        <SkeletonText />
      </div>
    </CardContent>
  </Card>
);

export { SkeletonStudySpotGridItem };
