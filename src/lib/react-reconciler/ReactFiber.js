export const createHostRootFiber = (rootDOM) => {
  return {
    key: null,
    type: 'HostRoot',
    return: null,
    child: null,
    sibling: null,
    index: 0,
    stateNode: rootDOM,
  };
};

export const createDom = (element) => {
  if (!element) return;

  if (typeof element === 'string' || typeof element === 'number') {
    const textNode = document.createTextNode(element);
    return textNode;
  }

  if (element.type === Symbol.for('mini-react.fragment')) {
    return null;
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

  return dom;
};

export const createFiberNode = (element) => {
  if (!element) return null;

  if (typeof element === 'string' || typeof element === 'number') {
    return {
      key: null,
      type: 'text',
      return: null,
      child: null,
      sibling: null,
      index: 0,
      stateNode: createDom(element),
    };
  }

  if (element.type === Symbol.for('mini-react.fragment')) {
    return {
      key: null,
      type: 'fragment',
      return: null,
      child: null,
      sibling: null,
      index: 0,
      stateNode: null,
    };
  }

  return {
    key: null,
    type: element.type,
    return: null,
    child: null,
    sibling: null,
    index: 0,
    stateNode: createDom(element),
  };
};

export const createFiberTree = (element, fiber) => {
  if (!element) return null;

  const newFiber = createFiberNode(element);
  newFiber.return = fiber;

  const children = element?.props?.children;

  if (!children) {
    return newFiber;
  }

  if (typeof children === 'string' || typeof children === 'number') {
    const childFiber = createFiberNode(children);
    childFiber.return = newFiber;
    newFiber.child = childFiber;
    return newFiber;
  }

  if (children && !Array.isArray(children)) {
    const childFiber = createFiberTree(children, newFiber);
    childFiber.return = newFiber;
    newFiber.child = childFiber;
    return newFiber;
  }

  let index = 0;
  let prevSibling = null;

  while (index < children.length) {
    const child = children[index];
    const childFiber = createFiberTree(child, newFiber);

    if (index === 0) {
      newFiber.child = childFiber;
    } else {
      prevSibling.sibling = childFiber;
    }

    prevSibling = childFiber;
    index++;
  }

  return newFiber;
};
