import * as React from 'react';

function StaticContainer(props) {
  return props.children;
}

export default React.memo(StaticContainer, (prevProps, nextProps) => {
  if (nextProps.forceUpdate) {
    return false;
  }
  const prevPropKeys = Object.keys(prevProps);
  const nextPropKeys = Object.keys(nextProps);

  if (prevPropKeys.length !== nextPropKeys.length) {
    return false;
  }

  // eslint-disable-next-line no-unused-vars
  for (const key of prevPropKeys) {
    if (key === 'children') {
      continue;
    }

    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }
  return !!nextProps.shouldUpdate;
});
