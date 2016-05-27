
import _ from 'lodash';
import d3 from 'd3';

import {
  DATA_PATH,
  filterData,
  countMatchedFilterGroups } from './util';


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

/** Returns Promise that resolves to information about
 * particular cell line.
 * @param {String} id of cell line to get
 * @return {Promise} cell line info object
 */
export function getCellLineInfo(cellLineId) {
  return new Promise(function(resolve, reject) {

    var path = DATA_PATH + 'cell_line_info.csv';

    // TODO: store after inital load.
    d3.csv(path, function(error, data) {
      if(error) {
        reject(error);
      } else {

        var cellLinesByName = _.keyBy(data, function(row) { return row['Name'].toLowerCase(); });

        var cellLine = cellLinesByName[cellLineId];

        if(cellLine) {
          resolve(cellLine);
        } else {
          reject('cell line not found ' + cellLineId);
        }
      }
    });
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
