import { useEventEmitter } from '@components/EventContext/eventHooks';
import React, { useState } from 'react';
import { DemoEvents } from '../type';

const Two = () => {
  const [two, setTwo] = useState('two');
  const { emit } = useEventEmitter<DemoEvents>();

  const handleClick = () => {
    setTwo('setTwo from  two');
  };

  const handleClick2 = () => {
    emit("reset", {
      title: 'form two',
      name: 'two name'
    })
  }

  return (
    <div>
      <div>two</div>
      <div>{two}</div>
      <button onClick={handleClick}>two click</button>
      <br />
      <button onClick={handleClick2}>two click To change one</button>
    </div>
  );
};

export default Two;
