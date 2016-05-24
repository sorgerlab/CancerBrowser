import _ from 'lodash';

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
 *
 */
export function filterData(dataset, filterGroup) {
  var filteredDataset;

  if(filterGroup && filterGroup.length > 0) {
    filteredDataset = _.filter(dataset, function(row) {

      var matches = getCategoricalMatches(row, filterGroup);

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
 *
 */
function getCategoricalMatches(row, filterGroup) {
  var matches = _.map(filterGroup, function(filter) {
    var matched = false;
    var possibleValues = _.flatten([filter.values]);
    // see if any of the data values are in the filter values
    _.flatten([row[filter.id]]).forEach(function(value) {
      if(_.includes(possibleValues, value)) {
        matched = true;
      }
    });
    return matched;
  });

  return matches;
}
