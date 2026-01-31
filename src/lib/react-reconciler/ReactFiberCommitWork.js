/**
 * Commit Phase: Fiber 트리를 순회하며 실제 DOM에 반영하는 함수
 *
 * 역할:
 * 1. Render Phase에서 조립된 detached DOM 트리를 실제 document에 연결
 * 2. stateNode가 있는 최상위 노드만 rootContainer에 appendChild
 * 3. Fragment 등 stateNode가 없는 노드는 자식들을 재귀적으로 처리
 *
 * 특징:
 * - Render Phase와 달리 실제 DOM 조작이 발생 (부수효과)
 * - 한 번 시작하면 중단 없이 완료 (동기적 실행)
 */
export const commitDOM = (fiber, rootContainer) => {
  if (!fiber) return;

  if (fiber.stateNode) {
    rootContainer.appendChild(fiber.stateNode);
  } else {
    let child = fiber.child;
    while (child) {
      commitDOM(child, rootContainer);
      child = child.sibling;
    }
  }
};
