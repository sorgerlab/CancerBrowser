import _ from 'lodash';

let DATA_PATH = '';
if(process.env.NODE_ENV === 'production') {
  DATA_PATH = '/CancerBrowser/cancerbrowser/data/';
} else {
  DATA_PATH = '/data/';
}

export { DATA_PATH };


/**
 * Filter a given row based dataset based on the categorical filters provided.
 *
 * dataset is an array of objects with consistent attributes:
 * [{id:'MMM', name:'', collection:['All','Big6']}]
 *
 * filterGroup is expected to be an array of filters in a filterGroup.
 * Each filter is an object with an 'id' string and an
 * array of strings in 'values'.
 * Example: {id:'collection', values:['Big6']}
 *
 * The filters work as a OR-ing within a filter and
 * AND-ing between filters.
 *
 * @param {Array} dataset Array of data objects
 * @param {Array} filterGroup Array of filter objects
 * @return {Array} array of filtered data
 *
 */
export function filterData(dataset, filterGroup) {
  let filteredDataset;

  if(filterGroup && filterGroup.length > 0) {
    filteredDataset = _.filter(dataset, function(row) {

      const matches = getCategoricalMatches(row, filterGroup);

      // now matches is an array of true/false values.
      // if there is a false value in matches, then then
      // row should be excluded.
      return !(_.includes(matches, false));
    });

  } else {
    filteredDataset = dataset;
  }
  return filteredDataset;
}

/*
 * Returns an array with one value for each value in the filterGroup.
 *
 * For each filter in the filter group, the array contains a true if
 * an attribute in the data row matches one of the allowed values for the
 * filter, and false otherwise.
 *
 * @param {Array} row Object row of the data
 * @param {Array} filterGroup Array of filter objects
 * @return {Array} array with true and false values.
 *
 */
function getCategoricalMatches(row, filterGroup) {
  const matches = _.map(filterGroup, function(filter) {
    let matched = false;
    const possibleValues = _.flatten([filter.values]);
    // see if any of the data values are in the filter values
    _.flatten([row[filter.id]]).forEach(function(value) {
      if(value && _.includes(possibleValues, value.value)) {
        matched = true;
      }
    });
    return matched;
  });

  return matches;
}

/**
 * Provides counts for each filter group in the allFilterGroup
 *
 * @param {Array} data array of data to match to
 * @param {Object} filter groups for the cell line data.
 *
 */
export function countMatchedFilterGroups(data, allFilterGroups) {
  const allCounts = {};
  Object.keys(allFilterGroups).forEach(function(key) {
    const filterGroup = allFilterGroups[key];
    allCounts[filterGroup.id] = countMatchedFilterGroup(data, filterGroup);
  });

  return allCounts;
}

/**
 * Provides counts for a single filter group
 *
 * @param {Array} data array of data to match to
 * @param {Object} filterGroup filter group for the cell line data.
 *
 */
export function countMatchedFilterGroup(data, filterGroup) {
  const filterGroupCounts = {};

  if (filterGroup && filterGroup.filters) {
    filterGroup.filters.forEach(function(filter) {
      filterGroupCounts[filter.id] = {};
      filterGroupCounts[filter.id]['counts'] = countMatchedFilterData(data, filter);
      filterGroupCounts[filter.id]['countMax'] = data.length;
    });
  }

  return filterGroupCounts;
}



/**
 * Provides counts for how many values match
 *
 */
function countMatchedFilterData(data, filter) {
  const filterCounts = {};
  filter.values.forEach(function(value) {
    const fakeFilterGroup = [{id:filter.id, values:value.value}];
    const results = filterData(data, fakeFilterGroup);
    filterCounts[value.value] = results.length;
  });

  return filterCounts;
}

/**
 * Merges two datasets based on a set of keys.
 * Performs a Left Merge - where every value in leftData
 * will be present in the new dataset and the values from
 * rightData will be added if found.
 * Data from rightData will be merged into leftData under its `namespace` attribute.
 *
 * @param {Array} leftData Array of values to serve as base data.
 * @param {Array} rightData Array of values to serve as additional data.
 * @param {String} leftKey Accessor into elements of leftData to serve as key
 *                 to match data on.
 * @param {String|Function} rightKey Accessor into elements of rightData to serve as key
 *                 to match data on.
 * @param {String|Function} namespace to put on leftData values where attributes of rightData
 *                 are added.
 * @return {Array} Array of objects with every object from leftData and
 *                 data from rightData appended to these objects if found.
 */
export function mergeData(leftData, rightData, leftKey, rightKey, namespace) {

  // const leftKeyed = _.keyBy(leftData, leftKey);
  const rightKeyed = _.keyBy(rightData, rightKey);

  const results = leftData.map(function(row) {

    const data = _.cloneDeep(row);
    // the namespace attribute will contain an empty object
    // if match is not found in rightData.
    data[namespace] = {};

    const keyValue = _.isFunction(leftKey) ? leftKey(row) : _.get(row, leftKey);

    const rightValues = _.get(rightKeyed, keyValue);

    if(rightValues) {
      data[namespace] = _.cloneDeep(rightValues);
    }

    return data;
  });

  return results;
}
