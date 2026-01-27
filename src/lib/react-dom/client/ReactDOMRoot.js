import { createFiberTree, createHostRootFiber } from '../../react-reconciler/ReactFiber';
import { commitDOM } from '../../react-reconciler/ReactFiberCommitWork';

const createRoot = (domNode) => {
  const _root = domNode;

  const updateContainer = function (element, hostRootFiber) {
    if (!element) return;

    const fiber = createFiberTree(element, hostRootFiber);
    fiber.return = hostRootFiber;

    commitDOM(fiber);
  };

  return {
    render: function (children) {
      const root = _root;

      const hostRootFiber = createHostRootFiber(root);
      updateContainer(children, hostRootFiber);
    },
  };
};

export { createRoot };
