const findParentNode = (fiber) => {
  let parent = fiber.return;

  while (parent) {
    if (parent.stateNode && parent.stateNode instanceof Element) {
      return parent.stateNode;
    }
    parent = parent.return;
  }

  return null;
};

export const commitDOM = (fiber) => {
  if (!fiber) return;

  if (fiber.type === 'fragment') {
    commitDOM(fiber.child);
    commitDOM(fiber.sibling);
    return;
  }

  if (fiber.stateNode) {
    const root = findParentNode(fiber);

    if (!root) {
      throw new Error('root element가 없습니다.');
    }
    root.appendChild(fiber.stateNode);
  }
  commitDOM(fiber.child);
  commitDOM(fiber.sibling);
};
