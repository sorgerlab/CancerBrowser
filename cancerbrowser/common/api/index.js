import fetch from 'isomorphic-fetch';

import { getCellLines } from './cell_line';
import { getDataset } from './dataset';

// TODO Need a much better way to handle this part
// of the hard coded URL.
// Server + Client mode
// const DATA_SERVER = "http://localhost:3000/";
// Client only mode
const DATA_SERVER = '';

// Basic get all
function getAll(filename) {
  return () => {
    return fetch(
      DATA_SERVER + 'sampledata/' + filename + '.json'
    ).then(
      res => res.json()
    );
  };
}

export default {
  getCells: getAll('cells'),
  getDatasets: getAll('datasets'),
  getCellsInDatasets: getAll('cellsInDatasets'),
  getCellLines: getCellLines,
  getDataset: getDataset
};
