import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { useEffect, useRef, version } from 'react';

type Dispatch<A> = (value: A) => void;

function useMountMergeState<S>(
  initialState: S | (() => S),
  option?: {
    defaultValue?: S;
    value?: S;
    onChange?: (value: S, prevValue: S) => void;
    postState?: (value: S) => S;
  },
): [S, Dispatch<S>] {
  const mountRef = useRef<boolean>(false);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    mountRef.current = true;
    return () => {
      clearTimeout(frame.current);
      mountRef.current = false;
    };
  }, []);

  const [state, setState] = useMergedState<S>(initialState, option);
  const mountSetState: Dispatch<S> = (prevState: S) => {
    clearTimeout(frame.current);
    frame.current = window.setTimeout(() => {
      if (mountRef.current) {
        setState(prevState);
      }
    }, 16);
  };

  // react 18 就不需要 mountSetState 了
  return version.startsWith('18') ? [state, setState] : [state, mountSetState];
}

export default useMountMergeState;
