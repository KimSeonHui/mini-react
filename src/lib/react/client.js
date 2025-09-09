export const createElement = (type, props, ...children) => {
  return {
    type,
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
