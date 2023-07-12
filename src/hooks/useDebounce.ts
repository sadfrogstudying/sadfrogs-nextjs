import { type DebouncedFunc, debounce } from "lodash";
import { useEffect, useMemo, useRef } from "react";

/**
 *
 * This hook returns a debounced callback
 * Ensures that debounce is only created once
 * The ref is used to store the callback and will be recreated
 * when the callback changes, i.e. when the component re-renders
 *
 * Credits: https://www.developerway.com/posts/debouncing-in-react
 *
 */
const useDebounce = <T extends () => void>(
  callback: T
): DebouncedFunc<() => void> => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, 1000);
  }, []);

  return debouncedCallback;
};

export default useDebounce;
