import React from 'react';
import { createContext, PropsWithChildren } from 'react';
import { BaseEvents, EventEmitter } from '@utils/EventEmitter';

export const EventEmitterContext = createContext<EventEmitter<any>>(
  null as any
);

export function EventEmitterRC<T extends BaseEvents>(
  props: PropsWithChildren<{ value: EventEmitter<T> }>
) {
  return (
    <EventEmitterContext.Provider value={props.value}>
      {props.children}
    </EventEmitterContext.Provider>
  );
}
