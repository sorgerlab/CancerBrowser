import datasetData from  '../assets/data/datasets.json';

/**
 * Returns dataset data
 * Data is imported directly from JSON file, but for future compatability with
 * an asynchronous retrieveal mechanism, this returns a
 * Promise
 *
 * @return {Promise}
 */
export function getDatasets() {
  return Promise.resolve(datasetData);
}

// TODO DELETE BELOW HERE

import d3 from 'd3';
import _ from 'lodash';

import { mergeData } from './util';

import { getCellLines } from './cell_line';

import datasetInfo from '../assets/data/datasets.json';

import { normalize } from '../../common/utils/string_utils';

const datasetContext = require.context('../assets/data/datasets/');

/** Returns Promise that resolves to data
 * for a particular dataset given its id
 * dataset values are stored in an array
 * Additional information about the dataset
 * can be acquired from getDatasetInfo
 * @param {String} id of dataset to get
 * @return {Promise} dataset array
 */
export function getDataset(datasetId) {
  const info = datasetInfo[datasetId];
  return new Promise(function(resolve, reject) {
    if(info) {
      const path = datasetContext(`./${info.filename}`);
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
    case 'growth_factor_pakt_perk_raw':
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
    row.id = normalize(row.label);
    const GR50 = row.GR50;
    if (GR50 === 'Inf') {
      row.GR50 = Number.POSITIVE_INFINITY;
    } else if (GR50 === '-Inf') {
      row.GR50 = Number.NEGATIVE_INFINITY;
    } else {
      row.GR50 = parseFloat(row.GR50);
    }
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
    row.id = normalize(row.label);

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
  let totalMin = Number.MAX_VALUE;
  let totalMax = Number.MIN_VALUE;

  dataset.forEach(function(row) {
    row.label = row[info.row_id];
    row.id = normalize(row.label);

    let minVal = Number.MAX_VALUE;
    let maxVal = Number.MIN_VALUE;

    const measurements = [];
    _.keys(row).forEach(function(key) {
      const keyIndex = info.cell_line_labels.indexOf(key);
      if(keyIndex >= 0) {
        const cellLineId = info.cell_lines[keyIndex];
        const measurement = {
          label: key,
          id: cellLineId,
          value: row[key]
        };

        if (measurement.value > maxVal) {
          maxVal = measurement.value;
          if (maxVal > totalMax) {
            totalMax = maxVal;
          }
        } else if (measurement.value < minVal) {
          minVal = measurement.value;
          if (minVal < totalMin) {
            totalMin = minVal;
          }
        }

        measurements.push(measurement);
      }
    });

    row.extent = [minVal, maxVal];
    row.measurements = measurements;

  });

  dataset.extent = [totalMin, totalMax];
  return dataset;
}


/**
 * Transform Basal Phospho data to be used in visualizations
 * @param {Array} dataset Dataset
 * @return {Array} transformed dataset
 */
function transformBasalPhospho(dataset, info) {
  let totalMin = Number.MAX_VALUE;
  let totalMax = Number.MIN_VALUE;

  dataset.forEach(function(row) {
    // phospho has a secondary string i.e: (K.GFINDDDDEDEGEEDEGS#DS#GDS#EDDVGHKK.R)
    // in the id column.
    const idFields = row[info.row_id].split(' ');
    row.label = idFields[0];
    row.id = normalize(row.label);
    row.descriptor = idFields[1];

    let minVal = Number.MAX_VALUE;
    let maxVal = Number.MIN_VALUE;

    const measurements = [];
    _.keys(row).forEach(function(key) {
      const keyIndex = info.cell_line_labels.indexOf(key);
      if(keyIndex >= 0) {
        const cellLineId = info.cell_lines[keyIndex];
        const measurement = {
          label: key,
          id: cellLineId,
          value: row[key]
        };

        if (measurement.value > maxVal) {
          maxVal = measurement.value;
          if (maxVal > totalMax) {
            totalMax = maxVal;
          }
        } else if (measurement.value < minVal) {
          minVal = measurement.value;
          if (minVal < totalMin) {
            totalMin = minVal;
          }
        }

        measurements.push(measurement);
      }
    });

    row.extent = [minVal, maxVal];
    row.measurements = measurements;
  });

  // dataset.extent = [totalMin, totalMax];

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
    row.id = normalize(row['Cell Line Name']);
    row.label = row['Cell Line Name'];

    const measurements = [];
    _.keys(row).forEach(function(key, index) {
      // if log is in the key, then it is a measurement
      if(key.includes('log')) {

        let measurement = {original: key,
                           value: row[key],
                           threshold: thresholds[key],
                           index: index};
        // grab a few more values.
        let fields = key.split(' ');
        // name of receptor
        measurement.receptor = fields[0];
        measurement.label = fields[0];
        measurement.id = normalize(fields[0]);
        if(measurement.value === measurement.threshold) {
          measurement.disabled = true;
        }
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
