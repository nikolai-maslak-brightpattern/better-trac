import { useCallback, useLayoutEffect, useRef } from 'react';

export function useEvent<T extends (...args: never[]) => unknown>(fn: T): T {
  const ref = useRef(fn);
  useLayoutEffect(() => {
    ref.current = fn;
  });
  return useCallback((...args: never[]) => ref.current(...args), []) as T;
}
