import React, { ReactNode } from 'react';
import { FixedLengthArray, FixedLengthArray2 } from './ArrayLengthMutationKeys';

interface Props {
  children: FixedLengthArray2<[ReactNode, ReactNode]>;
  // children: FixedLengthArray<ReactNode, 2>;
}

const Type = (props: Props) => {
  const { children } = props;

  return <div>{children}</div>;
};

export default Type;
