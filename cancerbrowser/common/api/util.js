import _ from 'lodash';

/**
 * Filter a given row based dataset based on the filters provided.
 *
 * dataset is an array of objects with consistent attributes:
 * [{id:'MMM', name:'', collection:['a','b']}]
 *
 * filters is expected to be an array of filterGroups.
 * Each filterGroup is an object with an 'id' string and an
 * array of strings in 'values'.
 * Example: {id:'collections', values:['Big6']}
 *
 * The filters work as a OR-ing within a filterGroup and
 * AND-ing between filterGroups.
 *
 * @param {Array} dataset Array of data objects
 * @param {Array} filters Array of filterGroup objects
 *
 */
export function filterData(dataset, filters) {
  var filteredDataset;

  if(filters && filters.length > 0) {
    filteredDataset = _.filter(dataset, function(row) {

      var matches = _.map(filters, function(filter) {
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
