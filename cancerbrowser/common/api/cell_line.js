
import { filterData } from './util';

import _ from 'lodash';

//TODO async load cell line data.
import cellLines from  './data/cell_lines.json';

export function getCellLines(filterGroups) {
  var filteredCellLines = _.clone(cellLines);
  filterGroups.forEach(function(filterGroup) {
    filteredCellLines = filterData(filteredCellLines, filterGroup);
  });
  return filteredCellLines;
}
