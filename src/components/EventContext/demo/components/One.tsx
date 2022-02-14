import { useEventEmitter } from '@components/EventContext/eventHooks';
import React, { useState, useEffect, useContext } from 'react';
import { DemoEvents } from '../type';

const One = (props, context) => {
  const [one, setOne] = useState('one');
  const { useListener } = useEventEmitter<DemoEvents>();

  useListener(
    'reset',
    (params) => {
      console.log(params);
      console.log(one);
    },
    [one]
  );

  const em = { useListener };
  useEffect(() => {
    console.log('em: ', em);
  }, [em]);

  const handleClick = () => {
    setOne('setOne from  one');
  };

  const handleClick2 = () => {};

  return (
    <div>
      <div>one</div>
      <div>{one}</div>
      {console.log('render one')}
      <button onClick={handleClick}>one click</button>
      <br />
      <button onClick={handleClick2}>one click To change two</button>
    </div>
  );
};

export default One;
