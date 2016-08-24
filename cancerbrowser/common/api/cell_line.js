
import _ from 'lodash';
import d3 from 'd3';

import {
  DATA_PATH,
  mergeData } from './util';


//TODO async load cell line data.
import cellLinesData from  '../assets/data/cell_lines.json';

import { normalize } from '../../common/utils/string_utils';

/**
 * Returns cell lines data
 *
 * @return {Array} cell line data
 */
export function getCellLines() {
  return new Promise(function(resolve) {
    resolve(_.clone(cellLinesData));
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
          data.forEach((d) => d.id = normalize(d['Cell Line']));

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

      const cellLinesByName = _.keyBy(allCellLineInfos, 'id');

      const cellLine = cellLinesByName[cellLineId];

      if(cellLine) {
        resolve(cellLine);
      } else {
        reject('cell line not found ' + cellLineId);
      }
    });
  });
}
