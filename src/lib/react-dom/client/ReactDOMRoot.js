const createRoot = (domNode) => {
  const _root = domNode;

  const updateContainer = function (element, container) {
    if (!element) return;
    if (typeof element === 'string' || typeof element === 'number') {
      const textNode = document.createTextNode(element);
      container.appendChild(textNode);
      return;
    }

    const dom = document.createElement(element.type);

    // props 추가
    Object.entries(element.props)
      .filter(([name]) => name !== 'children')
      .forEach(([name, value]) => {
        // event 연결
        if (name.startsWith('on') && typeof value === 'function') {
          const eventName = name.toLowerCase().slice(2);
          dom.addEventListener(eventName, value);
          return;
        }

        if (name === 'style') {
          Object.entries(value).forEach(([styleName, styleValue]) => {
            dom.style[styleName] = styleValue;
          });
          return;
        }

        if (name in dom) {
          dom[name] = value;
        } else {
          dom.setAttribute(name, value);
        }
      });

    const { children } = element.props;
    if (!children) {
      return;
    }
    if (typeof children === 'string' || typeof children === 'number') {
      const textNode = document.createTextNode(element.props.children);
      dom.appendChild(textNode);
    } else if (Array.isArray(children)) {
      element.props.children.forEach((child) => {
        updateContainer(child, dom);
      });
    } else {
      updateContainer(children, dom);
    }

    container.appendChild(dom);
  };

  return {
    render: function (children) {
      const root = _root;
      updateContainer(children, root);
    },
  };
};

export { createRoot };
