import { commitDOM } from './ReactFiberCommitWork';

const createHostRootFiber = (element, rootDOM) => {
  return {
    key: null,
    type: 'HostRoot',
    return: null,
    child: null,
    sibling: null,
    index: 0,
    stateNode: rootDOM,
    pendingProps: { children: element },
  };
};

const createDom = (element) => {
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

const createFiberNode = (element) => {
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
      pendingProps: element.props,
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
      pendingProps: element.props,
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
    pendingProps: element.props,
  };
};

/**
 * Fiber 노드의 자식 DOM 노드들을 부모 DOM 노드에 추가하는 함수
 *
 * 역할:
 * 1. 현재 Fiber의 자식들을 DFS(깊이 우선 탐색)로 순회
 * 2. 실제 DOM 노드(stateNode)를 가진 자식만 부모 DOM에 appendChild
 *    - document에는 추가 x, render phase에서는 부모 DOM에만 추가
 *    - 이후 commit phase에서 최상위 노드 하나만 실제 document에 연결
 *
 * 순회 흐름:
 * - 자식(child) → 형제(sibling) → 부모(return) 순으로 이동
 * - 시작 지점(fiber)으로 돌아오면 종료
 */
const appendAllChildren = (fiber) => {
  if (!fiber.stateNode || fiber.type === 'HostRoot') return;

  let node = fiber.child;
  while (node) {
    if (node.stateNode) {
      fiber.stateNode.appendChild(node.stateNode);
    } else if (node.child !== null) {
      node = node.child;
      continue;
    }

    if (node === fiber) return;

    // 형제가 없으면 부모로 올라감 (시작점까지)
    while (!node.sibling) {
      if (node.return === null || node.return === fiber) return;
      node = node.return;
    }

    // 형제로 이동
    node = node.sibling;
  }
};

let workInProgress = null;

/**
 * Fiber 트리의 작업 단위(Unit of Work)를 수행하는 함수
 *
 * 역할:
 * 1. 현재 Fiber의 자식들을 Fiber 노드로 변환하여 연결
 * 2. 다음에 처리할 Fiber를 반환 (트리 순회)
 *
 * TODO: 재조정(Reconciliation) 작업 추가
 *       - 기존 Fiber와 새 Element 비교 (Diffing)
 *       - 변경된 부분만 effect로 표시
 */
const performUnitOfWork = (unitOfWork) => {
  const children = unitOfWork.pendingProps?.children;

  if (children) {
    const childArray = Array.isArray(children) ? children : [children];
    let index = 0;
    let prevSibling = null;

    while (children && index < childArray.length) {
      const childFiber = createFiberNode(childArray[index]);
      childFiber.return = unitOfWork;

      if (index === 0) {
        unitOfWork.child = childFiber;
      } else {
        prevSibling.sibling = childFiber;
      }

      prevSibling = childFiber;
      index++;
    }
  }

  if (unitOfWork.child) {
    return unitOfWork.child;
  }

  let completedWork = unitOfWork;
  while (completedWork) {
    appendAllChildren(completedWork);

    if (completedWork.sibling) {
      return completedWork.sibling;
    }
    completedWork = completedWork.return;
  }

  return null;
};

/**
 * Fiber 트리 전체를 순회하며 작업을 수행하는 루프
 *
 * 역할:
 * 1. workInProgress가 null이 될 때까지 반복
 * 2. 각 반복마다 performUnitOfWork를 호출하여 하나의 Fiber 처리
 *
 * TODO: 현재는 동기 모드 (Sync Mode) - 한번 시작하면 끝까지 실행
 *       동시성 모드 (Concurrent Mode)로 전환 시:
 *       - shouldYield()로 "멈춰야 하나?" 체크 추가
 *       - 멈췄다가 재개할 수 있는 스케줄링 로직 필요
 */
const workLoop = () => {
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
};

export const updateContainer = (children, root) => {
  if (!children) return;

  const hostRootFiber = createHostRootFiber(children, root);
  workInProgress = hostRootFiber;

  workLoop(); // render phase
  commitDOM(hostRootFiber.child, root); // commit phase
};
