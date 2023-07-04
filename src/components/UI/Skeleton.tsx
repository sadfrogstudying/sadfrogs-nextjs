import styled from "@emotion/styled";
import { Card, CardContent, CardHeader } from "~/components/UI/Card";
import { formTokens } from "~/tokens";

const SkeletonImage = styled.div`
  aspect-ratio: 2 / 3;
  width: 100%;
  background-color: #e0e0e0;
  border-radius: ${formTokens.borderRadius}rem;
`;
const SkeletonText = styled.div<{ width?: string; height?: string }>`
  background-color: #e0e0e0;
  height: ${({ height }) => height || "1rem"};
  width: ${({ width }) => width || "100%"};
  margin-bottom: 0.5rem;
  border-radius: ${formTokens.borderRadius / 2}rem;
`;

const StudySpotGridItemSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <SkeletonImage />
      </CardHeader>
      <CardContent>
        <SkeletonText height="1.5rem" width="50%" />
        <div>
          <CardRow>
            <SkeletonText width="40%" />
            <SkeletonText />
          </CardRow>
          <CardRow>
            <SkeletonText width="40%" />
            <SkeletonText />
          </CardRow>
          <CardRow>
            <SkeletonText width="40%" />
            <SkeletonText />
          </CardRow>
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
};

export { SkeletonImage, StudySpotGridItemSkeleton };

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
`;
