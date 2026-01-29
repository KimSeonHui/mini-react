import { updateContainer } from '../../react-reconciler/ReactFiber';

const createRoot = (domNode) => {
  const _root = domNode;

  return {
    render: function (children) {
      if(_root === null) {
        throw new Error('마운트되지 않은 root에 업데이트 할 수 없습니다.')
      }

      const root = _root;
      updateContainer(children, root);

    },
  };
};

export { createRoot };
