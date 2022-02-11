import React from 'react';
import DraggleLayout from '../DraggleLayout';

const Index = () => {
  return (
    <DraggleLayout
      containerWidth={1440}
      containerHeight={600}
      min={100}
      max={800}
      initLeftWidth={200}
      handler={
        <div
          style={{
            width: 6,
            height: '100%',
            background: 'rgb(77, 81, 100)'
          }}
        />
      }
    >
      <div
        style={{
          backgroundColor: `rgb(36, 205, 208)`,
          color: `#fff`,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        left
      </div>
      <div
        style={{
          backgroundColor: `rgb(116, 140, 253)`,
          color: `#fff`,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        right
      </div>
    </DraggleLayout>
  );
};

export default Index;
