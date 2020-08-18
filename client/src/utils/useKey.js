import { useRef, useEffect } from 'react';

const useSpace = (key, cb) => {
  const callbackRef = useRef(cb);

  useEffect(() => {
    callbackRef.current = cb;
  });

  useEffect(() => {
    const handle = e => {
      if (e.code === 'Space') {
        e.preventDefault();
        callbackRef.current(e);
      }
    };
    document.addEventListener(key, handle);
    return () => document.removeEventListener(key, handle);
  }, []);
};

export default useSpace;
