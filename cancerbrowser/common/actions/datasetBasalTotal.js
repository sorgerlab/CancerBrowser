export const DATASET_BASAL_TOTAL_CHANGE_ACTIVE_FILTERS = 'DATASET_BASAL_TOTAL_CHANGE_ACTIVE_FILTERS';


/**
 * Action creator to modify the active filters for
 * dataset basal total page
 * @param {Object} activeFilters new filters of page
 */
export function changeActiveFilters(activeFilters) {
  return {
    type: DATASET_BASAL_TOTAL_CHANGE_ACTIVE_FILTERS,
    activeFilters
  };
}
