import { useEffect } from 'react';

/**
 * @hook useMount
 * @desc ComponentDidMount likes
 * */
const useMount = (callback: () => void) => {
  useEffect(callback, []);
};

export default useMount;
