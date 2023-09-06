import { Button } from "~/components/UI/Button";

const ErrorBoundaryFallbackRender = ({
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  return (
    <div role="alert" className="font-mono space-y-4 text-red-600">
      <strong>Error: </strong>
      <p>Something unexpected went wrong with the form 🥲</p>
      <p>
        If the issue persists, please email me at sadfrogsstudying@gmail.com
      </p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  );
};

export default ErrorBoundaryFallbackRender;
