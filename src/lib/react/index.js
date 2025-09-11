export const createElement = (type, props, ...children) => {
  if (typeof type === 'function') {
    return type(props);
  }

  return {
    type,
    key: props.key ?? null,
    ref: props.ref ?? null,
    props: {
      ...props,
      children: children.map((child) => {
        if (typeof child === 'string') {
          return child;
        } else {
          return createElement(child.type, child.props, ...child.props.children);
        }
      }),
    },
  };
};
