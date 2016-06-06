#!/usr/bin/env node
'use strict';

const fs = require('fs');
const d3 = require('d3');
const _  = require('lodash');

// cell_lines.json is first param
const filename = process.argv[2];

// dataset_info.json is second
const datasetInfoFilename = process.argv[3];

const datasetRoot = '../data/datasets/';

const drugs = require('./' + filename);

// add a spot for datasets we will populate in a bit
drugs.forEach(function(cl) {
  cl.dataset = [];
});

// pull in the dataset info
const datasetInfo = require(datasetInfoFilename);

// dataset info is an object, each key is a dataset id.
Object.keys(datasetInfo).forEach(function(key) {
  const info = datasetInfo[key];

  // skip if no drug id defined
  if (!info.drug_id) {
    return;
  }

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

  // pull out all the unique drug names.
  // we convert to lowercase here to match the id values of our
  //  cell_lines.json data.
  let drugsInDataset = data.map(d => d[info.drug_id]);

  drugsInDataset = _.uniq(drugsInDataset);

  // for each drug,
  // if the dataset had this drug in it.
  // then add the datset's id to the drug's dataset
  drugs.forEach(function(drug) {
    if(_.includes(drugsInDataset, drug.id)) {
      drug.dataset.push({ value: info.id, label: info.label });
    }
  });
});

// clobber old JSON and write new JSON
fs.writeFileSync(filename, JSON.stringify(drugs, null, 2));
