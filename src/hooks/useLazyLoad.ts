import { useEffect, useRef } from "react";

/**
 * @param fetchNextPage - the function to call when the element is on screen
 */
export default function useLazyLoad({
  fetchNextPage,
  options = {
    rootMargin: "300px",
  },
}: {
  fetchNextPage: () => void;
  options?: IntersectionObserverInit;
}) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) fetchNextPage();
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [fetchNextPage, options]);

  return [loadMoreRef] as const;
}
