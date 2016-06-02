
export const CHANGE_ACTIVE_FILTERS = 'CHANGE_ACTIVE_FILTERS';
export const RESET_ACTIVE_FILTERS = 'RESET_ACTIVE_FILTERS';

export function changeActiveFilters(activeFilters) {
  return {
    type: CHANGE_ACTIVE_FILTERS,
    activeFilters
  };
}

export function resetActiveFilters() {
  return {
    type: RESET_ACTIVE_FILTERS
  };
}
