#!/usr/bin/env node
'use strict';

const fs = require('fs');
const d3 = require('d3');
const _  = require('lodash');

const utils = require('./utils');


// cell_lines.json is first param
const filename = process.argv[2];

// dataset_info.json is second
const datasetInfoFilename = process.argv[3];

const datasetRoot = '../data/datasets/';

const cellLines = require('./' + filename);

// add a spot for datasets we will populate in a bit
cellLines.forEach(function(cl) {
  cl.dataset = [];
});

// pull in the dataset info
const datasetInfo = require(datasetInfoFilename);

// dataset info is an object, each key is a dataset id.
Object.keys(datasetInfo).forEach(function(key) {

  const info = datasetInfo[key];

  // skip if not primary entry for the dataset
  if (info.exclude_from_datasets) {
    return;
  }

  // the values are info objects.
  const filename = datasetRoot + info.filename;


  // read the data file
  let data = fs.readFileSync(filename, 'utf8');

  // convert to tsv
  data = d3.tsv.parse(data);

  // Some of our datasets have the cell lines as column names instead of
  // attributes, so I have manually encoded this in our dataset info
  let cellLinesInDataset = info.cell_lines;

  // if this isn't the case, then we can extract it from our datasets

  if(!cellLinesInDataset)  {
    // pull out all the unique cell line names.
    // we convert to lowercase here to match the id values of our
    //  cell_lines.json data.
    cellLinesInDataset = data.map(d => utils.getId(d[info.cell_line_id]));

    cellLinesInDataset = _.uniq(cellLinesInDataset);
  }


  // for each cell line,
  // if the dataset had this cell line in it.
  // then add the datset's id to the cell line's dataset
  cellLines.forEach(function(cl) {
    if(_.includes(cellLinesInDataset, cl.id)) {
      cl.dataset.push({value:info.id, label:info.label});
    }
  });
});

// clobber old JSON and write new JSON
fs.writeFileSync(filename, JSON.stringify(cellLines, null, 2));
