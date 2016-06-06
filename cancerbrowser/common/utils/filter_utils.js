import _ from 'lodash';
import * as ImmutableUtils from './immutable_utils';

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
    if (filterGroup) {
      const filter = filterGroup.filters.find(f => f.id === filterId);
      return filter.values.find(v => v.value === value);
    }
  }

  return value;
}


/**
 * Handles updating the filter values for a given group/filterId
 * This includes removing the whole filter group if nothing is in it anymore
 *
 * @param {Object} activeFilters the active filters
 * @param {String} filterGroupId The ID of the filter group (e.g., 'cellLineFilters')
 * @param {String} filterId The ID of the filter (e.g., 'collection')
 * @param {Array} newFilterValuesList The array of new values for the given filter
 *
 * @return {Object} The new activeFilters object.
 */
export function updateFilterValues(activeFilters, filterGroupId, filterId, newFilterValuesList) {
  // for simplicity of interface, make all newFilterValuesList arrays
  if (!_.isArray(newFilterValuesList)) {
    newFilterValuesList = newFilterValuesList == null ? [] : [newFilterValuesList];
  }

  // create a new object with this filter and its new values
  const newFilterValues = { id: filterId, values: newFilterValuesList };

  // find the active filters for the group
  let activeFiltersForGroup = undefined;
  if(activeFilters) {
    activeFiltersForGroup = activeFilters[filterGroupId];
  }
  let activeFiltersFilterIndex;

  // find the index of the filter inside the group's active filters
  if (activeFiltersForGroup) {
    activeFiltersFilterIndex = activeFiltersForGroup.findIndex(activeFilter => activeFilter.id === filterId);
  }

  // if we have no set values for this filter, remove it
  if (!newFilterValuesList.length) {
    if (activeFiltersForGroup) {
      // this was the only filter set, remove the whole group
      if (activeFiltersForGroup.length === 1) {
        activeFiltersForGroup = null;

      // there were multiple filters set, remove just this one
      } else {
        activeFiltersForGroup = ImmutableUtils.arrayRemove(activeFiltersForGroup, activeFiltersFilterIndex);
      }
    }

  // there are some values for this filter, so ensure it is updated or added
  } else {
    // group did not have values before, so create the group level initialized with this value
    if (!activeFiltersForGroup) {
      activeFiltersForGroup = [newFilterValues];

    // this group had values before
    } else {
      // replace the existing values
      if (activeFiltersFilterIndex !== -1) {
        activeFiltersForGroup = ImmutableUtils.arraySet(activeFiltersForGroup, activeFiltersFilterIndex, newFilterValues);

      // add new values
      } else {
        activeFiltersForGroup = activeFiltersForGroup.concat(newFilterValues);
      }
    }
  }

  // Integrate the updated filter group into the other activeFilters
  let newActiveFilters;
  if (activeFiltersForGroup === null) {
    newActiveFilters = _.omit(activeFilters, filterGroupId);
  } else {
    newActiveFilters = Object.assign({}, activeFilters, { [filterGroupId]: activeFiltersForGroup });
  }

  return newActiveFilters;
}

