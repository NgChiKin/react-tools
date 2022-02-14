import React, { useState } from 'react';
import One from './components/One';
import Two from './components/Two';
import { useEventEmitter } from '../eventHooks';
import { EventEmitterRC } from '../EventEmitterRC';

const Index = () => {
  const { emitter } = useEventEmitter();

  return (
    <div>
      <button onClick={() => console.log(emitter.listeners('reset'))}>
        see event listeners
      </button>
      container
      <EventEmitterRC value={emitter}>
        <One />
        <Two />
      </EventEmitterRC>
    </div>
  );
};

export default Index;
