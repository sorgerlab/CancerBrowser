import d3 from 'd3';
import _ from 'lodash';
// import fetch from 'isomorphic-fetch';

import { DATA_PATH,
         mergeData } from './util';

import { getCellLines } from './cell_line';

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

      var path = DATA_PATH + 'datasets/' + info.filename;

      d3.tsv(path, function(error, data) {
        if(error) {
          reject(error);
        } else {
          resolve(transformData(data, info));
        }
      });

    } else {
      reject('Not valid dataset Id ' + datasetId);
    }
  }).then(mergeCellLines);
}

/**
 * Merge in cell line data for each row in the dataset.
 * Expects dataset to have `id` attribute that refers to its cell line.
 * @param {Array} dataset
 * @return {Array} with cell line data merged in as `cell_line` attribute.
 */
function mergeCellLines(dataset) {
  return getCellLines().then(function(cellLines) {
    return mergeData(dataset, cellLines, 'id', 'id', 'cell_line');
  });
}

/**
 * Custom data transformations for the different datasets.
 * @param {Array} dataset parsed dataset file
 * @param {Object} info Info about the dataset.
 * @return {Array} transformed data
 */
function transformData(dataset, info) {
  dataset = convertStringsToNumbers(dataset, info.text_fields);
  switch(info.id) {
    case 'receptor_profile':
      dataset = transformReceptorData(dataset);
  }

  return dataset;
}

/**
 * Convert receptor data to a useable form.
 * The receptor data has its last row as the detection thresholds.
 * We need to associate a threshold with each detection value.
 * Original columns look like: ERK1/2 log_{10}(pg/cell): value.
 *
 * Modified columns should looke like:
 * {index:2, label:"ERK1/2 log_{10}(pg/cell)", metric:"pg/cell",
 *  receptor:"ERK1/2", threshold:-4.6696, value:-3.3432}
 *
 * index indicates order in which we see the key column.
 * threshold is pulled in from the last row.
 *
 * Data manipulation happens in place.
 *
 */
function transformReceptorData(dataset) {

  let thresholds = dataset.pop();

  dataset.forEach(function(row) {
    row.id = row['Cell Line Name'].toLowerCase();

    var measurements = [];
    _.keys(row).forEach(function(key, index) {
      // if log is in the key, then it is a measurement
      if(key.includes('log')) {

        let measurement = {label: key,
                           value: row[key],
                           threshold: thresholds[key],
                           index: index};
        // grab a few more values.
        let fields = key.split(' ');
        // name of receptor
        measurement.receptor = fields[0];
        // get out the metric.
        let metric = fields[1].match(/\((.*)\)/)[1];
        measurement.metric = metric;

        measurements.push(measurement);
        // remove the original value.
        delete row[key];
      }
    });
    row.measurements = measurements;
  });

  return dataset;
}

/**
 * Helper function that ensures number columns in the dataset
 * are not strings.
 * WARNING: this transformation currently occurs in place.
 *
 * @param {Array}  dataset The dataset to workon
 * @param {Array} excludedColumns array of columns that should not
 *  be converted.
 * @return {Array} the modified dataset
 */
function convertStringsToNumbers(dataset, excludedColumns) {
  dataset.forEach(function(row) {
    Object.keys(row).forEach(function(key) {
      if(!excludedColumns.includes(key)) {
        row[key] = +row[key];
      }
    });
  });

  return dataset;
}
