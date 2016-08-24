import cellLineData from  '../assets/data/cell_lines.json';

/**
 * Returns cell line data
 * Data is imported directly from JSON file, but for future compatability with
 * an asynchronous retrieveal mechanism, this returns a
 * Promise
 *
 * @return {Promise}
 */
export function getCellLines() {
  return Promise.resolve(cellLineData);
}
