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
 * Gets the active value for a given filter
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



/**
 * Gets the active value from the filter definition for a given filter
 *
 * @param {Array} filterGroups the filter groups definitions
 * @param {Object} activeFilters the active filters
 * @param {String} filterGroupId
 * @param {String} filterId
 * @return {Any} The filter value definition of the first value in the activeFilters value array
 */
export function getFilterValueItem(filterGroups, activeFilters, filterGroupId, filterId) {
  const value = getFilterValue(activeFilters, filterGroupId, filterId);

  if (value != null) {
    const filterGroup = filterGroups.find(fg => fg.id === filterGroupId);
    const filter = filterGroup.filters.find(f => f.id === filterId);
    return filter.values.find(v => v.value === value);
  }

  return value;
}
