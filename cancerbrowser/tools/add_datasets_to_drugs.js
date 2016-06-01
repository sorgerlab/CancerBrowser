#!/usr/bin/env node

var fs = require('fs');
var d3 = require('d3');
var _  = require('lodash');

// cell_lines.json is first param
var filename = process.argv[2];

// dataset_info.json is second
var datasetInfoFilename = process.argv[3];

var datasetRoot = '../data/datasets/';

var drugs = require('./' + filename);

// add a spot for datasets we will populate in a bit
drugs.forEach(function(cl) {
  cl.dataset = [];
});

// pull in the dataset info
var datasetInfo = require(datasetInfoFilename);

// dataset info is an object, each key is a dataset id.
Object.keys(datasetInfo).forEach(function(key) {
  var info = datasetInfo[key];

  // skip if no drug id defined
  if (!info.drug_id) {
    return;
  }

  // the values are info objects.
  var filename = datasetRoot + info.filename;


  // read the data file
  var data = fs.readFileSync(filename, 'utf8');

  // convert to tsv
  data = d3.tsv.parse(data);

  // pull out all the unique drug names.
  // we convert to lowercase here to match the id values of our
  //  cell_lines.json data.
  var drugsInDataset = data.map(d => d[info.drug_id]);

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
