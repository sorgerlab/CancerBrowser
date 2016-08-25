'use strict';

const fs = require('fs');
const path = require('path');
const d3 = require('d3');
const _  = require('lodash');

const utils = require('./utils');

const DATA_PATH = path.join(__dirname, '..', 'data')
const DATASETS_PATH = path.join(DATA_PATH, 'datasets')

function parse_datasets() {

  const infoPath = path.join(DATA_PATH, 'datasets.json')
  const dataSetInfo = require(path.relative(__dirname, infoPath));

  // Convert json object into a Map keyed on string id.
  const dataSets = new Map();
  for (const k of Object.keys(dataSetInfo)) {
    dataSets.set(k, dataSetInfo[k]);
  }

  dataSets.forEach(function(info, key) {

    // skip if not primary entry for the dataset
    if (info.exclude_from_datasets) {
      return;
    }

    // the values are info objects.
    const datasetPath = path.join(DATASETS_PATH, info.filename);
    // read the data file
    let data = fs.readFileSync(datasetPath, 'utf8');

    // convert to tsv
    data = d3.tsv.parse(data);

    // Some of our datasets have the cell lines as column names instead of
    // attributes, so I have manually encoded this in our dataset info
    let cellLines = info.cell_lines;
    // if this isn't the case, then we can extract it from our datasets
    if (!cellLines)  {
      // pull out all the unique cell line names.
      // we convert to lowercase here to match the id values of our
      //  cell_lines.json data.
      cellLines = data.map(d => utils.getId(d[info.cell_line_id]));
      cellLines = _.uniq(cellLines);
    }

    // pull out all the unique drug names.
    // we convert to lowercase here to match the id values of our
    //  cell_lines.json data.
    let drugs = data.map(d => d[info.drug_id]);
    drugs = _.uniq(drugs);

    info.cellLines = cellLines;
    info.drugs = drugs;
  });

  return dataSets;
}

module.exports = parse_datasets;
