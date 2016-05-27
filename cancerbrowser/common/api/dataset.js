import d3 from 'd3';
// import fetch from 'isomorphic-fetch';

import { DATA_PATH } from './util';

import datasetInfo from './data/dataset_info.json';


/** Returns Promise that resolves to information about
 * each dataset in an Object where
 * each attribute is a dataset key.
 * @return {Promise} datasets info
 */
export function getDatasets() {
  return new Promise(function(resolve) {
    resolve(datasetInfo);
  });
}

/** Returns Promise that resolves to information about
 * particular dataset.
 * @param {String} id of dataset to get
 * @return {Promise} datasets info object
 */
export function getDatasetInfo(datasetId) {
  return getDatasets()
    .then(datasets => datasets[datasetId]);
}

/** Returns Promise that resolves to data
 * for a particular dataset given its id
 * dataset values are stored in an array
 * Additional information about the dataset
 * can be acquired from getDatasetInfo
 * @param {String} id of dataset to get
 * @return {Promise} dataset array
 */
export function getDataset(datasetId) {
  return new Promise(function(resolve, reject) {
    if(datasetInfo[datasetId]) {
      var info = datasetInfo[datasetId];

      var path = DATA_PATH + info.filename;

      d3.tsv(path, function(error, data) {
        if(error) {
          reject(error);
        } else {
          resolve(transformDataset(data, info));
        }
      });

    } else {
      reject('Not valid dataset Id ' + datasetId);
    }
  });
}

/**
 * Helper function that ensures number columns in the dataset
 * are not strings.
 * WARNING: this transformation currently occurs in place.
 *
 * @param {Array}  dataset The dataset to workon
 * @param {Object} info Information about dataset
 *  that includes text_fields attribute to indicate
 *  which columns should not be converted.
 * @return {Array} the modified dataset
 */
function transformDataset(dataset, info) {
  dataset.forEach(function(row) {
    Object.keys(row).forEach(function(key) {
      if(!info.text_fields.includes(key)) {
        row[key] = +row[key];
      }
    });
  });

  return dataset;
}
