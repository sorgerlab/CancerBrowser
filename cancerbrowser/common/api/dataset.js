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
export function getDatasetsInfo() {
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
  return getDatasetsInfo()
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
export function getDataset(datasetId, format) {
  const info = datasetInfo[datasetId];
  return new Promise(function(resolve, reject) {
    if(info) {
      const path = DATA_PATH + 'datasets/' + info.filename;

      d3.tsv(path, function(error, data) {
        if(error) {
          reject(error);
        } else {
          resolve(transformData(data, info, format));
        }
      });

    } else {
      reject('Not valid dataset Id ' + datasetId);
    }
  }).then(function(dataset) {
    // some datasets are not arranged by cell line.
    // TODO: this could be moved somewhere else, or
    // we could make mergeCellLines more robust.
    if(info.cell_line_id) {
      return mergeCellLines(dataset);
    } else {
      return dataset;
    }

  });
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
      break;
    case 'growth_factor_pakt_perk':
      dataset = transformGrowthFactor(dataset, info);
      break;
    case 'basal_total':
      dataset = transformBasalTotal(dataset, info);
      break;
    case 'basal_phospho':
      dataset = transformBasalPhospho(dataset, info);
      break;
    case 'drug_dose_response':
      dataset = transformDoseResponse(dataset, info);
      break;
  }

  return dataset;
}

/**
 * Transform Basal Total data to be used in visualizations
 * @param {Array} dataset Dataset
 * @return {Array} transformed dataset
 */
function transformDoseResponse(dataset, info) {
  dataset.forEach(function(row) {
    row.label = row[info.row_id];
    row.id = row.label.toLowerCase();
  });
  return dataset;
}


/**
 * Transform Growth Factor data to be used in visualizations
 * @param {Array} dataset Dataset
 * @return {Array} transformed dataset
 */
function transformGrowthFactor(dataset, info) {

  dataset.forEach(function(row) {
    row.label = row[info.row_id];
    row.id = row.label.toLowerCase();

    const measurements = [];
    _.keys(row).forEach(function(key, index) {
      // if log is in the key, then it is a measurement
      if(key.includes('Measured')) {
        const mTitleRegex = /Measured\s+(\w*):(\w+)\s+(\w+)\((.*)\)/;
        const fields = key.match(mTitleRegex);

        let measurement = {
          label: key,
          value: row[key],
          index: index,
          type: fields[1],
          time: fields[2],
          scale: fields[3],
          metric: fields[4]
        };

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
 * Transform Basal Total data to be used in visualizations
 * @param {Array} dataset Dataset
 * @return {Array} transformed dataset
 */
function transformBasalTotal(dataset, info) {
  dataset.forEach(function(row) {
    row.label = row[info.row_id];
    row.id = row.label.toLowerCase();
  });
  return dataset;
}


/**
 * Transform Basal Phospho data to be used in visualizations
 * @param {Array} dataset Dataset
 * @return {Array} transformed dataset
 */
function transformBasalPhospho(dataset, info) {
  dataset.forEach(function(row) {
    // phospho has a secondary string i.e: (K.GFINDDDDEDEGEEDEGS#DS#GDS#EDDVGHKK.R)
    // in the id column.
    const idFields = row[info.row_id].split(' ');
    row.label = idFields[0];
    row.id = row.label.toLowerCase();

    row.descriptor = idFields[1];
  });
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

  // last value is the thresholds
  let thresholds = dataset.pop();


  dataset.forEach(function(row) {
    row.id = row['Cell Line Name'].toLowerCase();
    row.label = row['Cell Line Name'];

    const measurements = [];
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
        measurement.id = fields[0].toLowerCase();
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
