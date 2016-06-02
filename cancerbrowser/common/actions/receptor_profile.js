
export const CHANGE_HIGHLIGHT = 'CHANGE_ACTIVE_FILTERS';
export const CHANGE_ACTIVE_LEFT = 'CHANGE_ACTIVE_LEFT';
export const CHANGE_ACTIVE_RIGHT = 'CHANGE_ACTIVE_RIGHT';

export function changeHighlight(highlightId) {
  return {
    type: CHANGE_HIGHLIGHT,
    highlightId
  };
}

export function changeActiveLeft(activeId) {
  return {
    type: CHANGE_ACTIVE_LEFT,
    activeId
  };
}

export function changeActiveRight(activeId) {
  return {
    type: CHANGE_ACTIVE_RIGHT,
    activeId
  };
}
