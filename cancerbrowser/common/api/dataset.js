import d3 from 'd3';
// import fetch from 'isomorphic-fetch';

import datasetInfo from './data/dataset_info.json';

const DATA_PATH = '/data/datasets/';


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

function transformDataset(data, info) {
  data.forEach(function(row) {
    Object.keys(row).forEach(function(key) {
      if(!info.text_fields.includes(key)) {
        row[key] = +row[key];
      }
    });
  });

  return data;
}
