
import { filterData, countMatchedFilterGroups } from './util';

import _ from 'lodash';

//TODO async load cell line data.
import cellLinesData from  './data/cell_lines.json';

/**
 * Returns filtered cell line data given a set of filters
 *
 * @param {Object} filterGroups object with keys as each id
 *  of the filter group. Values are objects passed to filterData
 * @return {Array} filtered set of cell line data
 */
export function getCellLines(filterGroups = {}) {
  return new Promise(function(resolve) {

    var filteredCellLines = _.clone(cellLinesData);
    Object.keys(filterGroups).forEach(function(key) {
      var filterGroup = filterGroups[key];
      filteredCellLines = filterData(filteredCellLines, filterGroup);
    });
    resolve(filteredCellLines);
  });

}

/**
 * Provides counts for each filter group in the allFilterGroup
 *
 * @param {Array} cellLines array of cell line data to match
 * @param {Object} filter groups for the cell line data.
 *
 */
export function getCellLineCounts(cellLines, allFilterGroups) {
  return countMatchedFilterGroups(cellLines, allFilterGroups);
}
