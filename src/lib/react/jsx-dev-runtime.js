export const Fragment = Symbol.for('mini-react.fragment');

export const jsxDEV = (type, props, key) => {
  if (typeof type === 'function') {
    return type(props);
  }

  return {
    type,
    key: key ?? props?.key ?? null,
    ref: props?.ref ?? null,
    props: {
      ...props,
      children: props.children,
    },
  };
};
