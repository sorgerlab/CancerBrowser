
import _ from 'lodash';
import d3 from 'd3';

import {
  DATA_PATH,
  filterData,
  countMatchedFilterGroups,
  mergeData } from './util';


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
 * Returns Promise which resolves to array of all cell line info values
 * merged with the cell line data.
 *
 * Cell line info is merged as `info` attribute of cell line data.
 *
 * @return {Array} filtered set of cell line data
 */
export function getCellLineInfos() {
  return getCellLines().then(function(allCellLines) {
    return new Promise(function(resolve, reject) {

      let path = DATA_PATH + 'cell_line_info.csv';

      // TODO: store after inital load.
      d3.csv(path, function(error, data) {
        if(error) {
          reject(error);
        } else {

          // add consistent ID value for matching.
          data.forEach((d) => d.id = d['Cell Line'].toLowerCase());

          let results = mergeData(allCellLines, data, 'id', 'id', 'info');
          resolve(results);
        }
      });
    });
  });
}


/** Returns Promise that resolves to information about
* particular cell line.
* @param {String} id of cell line to get
* @return {Promise} cell line info object
*/
export function getCellLineInfo(cellLineId) {
  return getCellLineInfos().then(function(allCellLineInfos) {
    return new Promise(function(resolve, reject) {

      var cellLinesByName = _.keyBy(allCellLineInfos, 'id');

      var cellLine = cellLinesByName[cellLineId];

      if(cellLine) {
        resolve(cellLine);
      } else {
        reject('cell line not found ' + cellLineId);
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
