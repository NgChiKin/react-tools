import React, { useContext, useReducer, useState, useRef, useMemo, useEffect } from 'react';
import { isEmpty, isEqual, mergeWith, cloneDeep } from 'lodash';
import EventEmitter from 'events';

const useForceUpdate = () => {
  const [_, setState] = useState(false);
  return () => setState((val) => !val);
};

interface UseSetState {
  <TState = any>(): React.Dispatch<Partial<TState> | ((data: Partial<TState>) => Partial<TState>)>;
}

interface UseSelector {
  <TState = any, TSelected = any>(selector: (state: TState) => TSelected): TSelected;
}

interface ProviderProps {
  initState?: any;
  children?: any;
}

export class CustomContext extends EventEmitter {
  public context;
  constructor(context) {
    super();
    this.context = context;
  }

  private reducer = (state, value) => {
    let _state = cloneDeep(state);

    if (typeof value === 'function') {
      _state = value(_state);
      return _state;
    } else if (isEmpty(value)) {
      return state;
    } else {
      _state = mergeWith(_state, value, (objValue, srcValue) => {
        if (!srcValue) {
          return null;
        }
      });
      return _state;
    }
  };

  //用于设置contextData的setter
  useSetState: UseSetState = () => {
    const store = useContext<any>(this.context);
    if (!store) {
      throw new Error('必须在Provider内使用useSetState');
    }

    return store.dispatch;
  };

  //模仿redux-useSelector，通过发布订阅达到只有使用的数据更新时才会触发渲染
  useSelector: UseSelector = (selector) => {
    const forceUpdate = useForceUpdate();
    const store = useContext<any>(this.context);
    if (!store) {
      throw new Error('必须在Provider内使用useSelector');
    }

    const latestSelector = useRef(selector);
    const latestSelectedState = useRef(selector(store.getState()));
    latestSelector.current = selector;
    latestSelectedState.current = selector(store.getState());

    useEffect(() => {
      const checkForUpdates = () => {
        const newSelectedState = latestSelector.current(store.getState());
        //state发生变化时，检查当前selectedState和更新后的SelectedState是否一致，不一致则触发渲染
        if (!isEqual(newSelectedState, latestSelectedState.current)) {
          forceUpdate();
        }
      };

      this.on('stateChange', checkForUpdates);
      return () => {
        this.off('stateChange', checkForUpdates);
      };
    }, [store]);

    return cloneDeep(latestSelectedState.current);
  };

  //contextProvider
  Provider = (props: ProviderProps) => {
    const { children, initState = {} } = props;
    const [state, dispatch] = useReducer(this.reducer, initState);
    const stateRef = useRef(state);
    stateRef.current = state;

    useEffect(() => {
      //告知useSelector，state已更新，让它触发forceUpdate
      this.emit('stateChange', state);
    }, [state]);

    //store值不会更新，所以不会触发渲染
    const store = useMemo(
      () => ({
        getState: () => cloneDeep(stateRef.current),
        dispatch,
      }),
      [],
    );

    return <this.context.Provider value={store}>{children}</this.context.Provider>;
  };
}
