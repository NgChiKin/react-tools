/**
 * 为元素添加事件, 并且返回事件解绑函数, 利用编辑器提醒别忘了解绑
 * @param target dom 元素
 * @param event 事件类型
 * @param callback 回调函数
 * @param args
 * @returns 事件解绑函数
 */
 export const on = (target: any, event: string, callback: any, ...args: any) => {
  target.addEventListener(event, callback, ...args);

  return target.removeEventListener.bind(target, event, callback, ...args);
};