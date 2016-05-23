
import { filterData } from './util';

//TODO async load cell line data.
import cellLines from  './data/cell_lines.json';

export function getCellLines(filters) {
  return filterData(cellLines, filters);
}
