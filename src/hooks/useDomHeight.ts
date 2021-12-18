import { useEffect, useState } from "react";
import { throttle } from "lodash";
import useMount from "@hooks/useMount";
import { on } from "@utils/dom";

/**
 * 窗口变化实时返回元素高度
 * @param ref React.ref 需要计算高度的对象
 * @returns 实时返回对象的高度
 */
 export const useHeight = (ref: React.MutableRefObject<any>) => {

  const [height, setHeight] = useState<number>(0);

  const resize = throttle(() => {
    const el = ref.current
    el.clientHeight !== height && setHeight(el.clientHeight);
  }, 100)

  useEffect(() => {
    if(ref.current) {
      setHeight(ref.current.clientHeight)
    }
  }, [ref])

  useMount(() => {
    const removeListener = on(window, 'resize', resize)
    return () => {
      removeListener();
    }
  });

  const updateHeight = () => {
    if(ref.current) {
      setHeight(ref.current.clientHeight)
    }
  }

  return {height, updateHeight};
}