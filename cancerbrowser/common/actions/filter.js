
export const CHANGE_ACTIVE_FILTERS = 'CHANGE_ACTIVE_FILTERS';

export function changeActiveFilters(activeFilters) {
  return {
    type: CHANGE_ACTIVE_FILTERS,
    activeFilters
  };
}
