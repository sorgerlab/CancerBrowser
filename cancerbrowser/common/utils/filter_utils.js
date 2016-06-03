/**
 * Gets the active values for a given filter
 *
 * @param {Object} activeFilters the active filters
 * @param {String} filterGroupId
 * @param {String} filterId
 * @return {Array} array of values
 */
export function getFilterValues(activeFilters, filterGroupId, filterId) {
  if (!activeFilters || !activeFilters[filterGroupId]) {
    return undefined;
  }

  const filters = activeFilters[filterGroupId];
  const filter = filters.find(f => f.id === filterId);

  return filter && filter.values;
}

/**
 * Gets the active values for a given filter
 *
 * @param {Object} activeFilters the active filters
 * @param {String} filterGroupId
 * @param {String} filterId
 * @return {Any} The first value in the values array
 */
export function getFilterValue(activeFilters, filterGroupId, filterId) {
  const values = getFilterValues(activeFilters, filterGroupId, filterId);

  return values && values[0];
}
