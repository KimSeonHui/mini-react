export const Fragment = Symbol.for('mini-react.fragment');

export const jsx = (type, props, key) => {
  if (typeof type === 'function') {
    return type(props);
  }

  return {
    type,
    key: key ?? props?.key ?? null,
    ref: props?.ref ?? null,
    props: {
      ...props,
      children:
        typeof props.children === 'string'
          ? props.children
          : props.children.map((child) => {
              if (typeof child === 'string') {
                return child;
              } else {
                return jsx(child.type, child.props);
              }
            }),
    },
  };
};

export const jsxs = jsx;
