import fetch from 'isomorphic-fetch';

// TODO Need a much better way to handle this part
// of the hard coded URL.
// Server + Client mode
// const DATA_SERVER = "http://localhost:3000/";
// Client only mode
const DATA_SERVER = "";

// Basic get all
function getAll(filename) {
  return () => {
    return fetch(
      DATA_SERVER + 'sampledata/' + filename + '.json'
    ).then(
      res => res.json()
    );
  }
}

// Basic get specific
function getSpecific(filename) {
  return (id) => {
    return fetch(
      DATA_SERVER + 'sampledata/' + filename + '-' + id + '.json'
    ).then(
      res => res.json()
    );
  }
}

export default {
  getCells: getAll('cells'),
  getDatasets: getAll('datasets'),
  getCellsInDatasets: getAll('cellsInDatasets'),
  getDataset: getSpecific('dataset')
}
