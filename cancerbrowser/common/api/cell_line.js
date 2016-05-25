
import { filterData } from './util';

import _ from 'lodash';

//TODO async load cell line data.
import cellLinesData from  './data/cell_lines.json';

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
