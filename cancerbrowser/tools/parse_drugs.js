'use strict';

const fs = require('fs');
const path = require('path');
const d3 = require('d3');
const _  = require('lodash');

const parse_datasets = require('./parse_datasets');

function normalize(str) {
  return _.trim(str).replace(/[\s-]/g, '').toLowerCase();
}

function labelValue(str, valueOverrides) {
  const label = _.trim(str);

  if (label.length === 0) {
    return null;
  }

  let value = normalize(str);

  if (valueOverrides && valueOverrides[value]) {
    value = valueOverrides[value];
  }

  return { label, value };
}

// overrides to the value that enable proper sort with no effort
const developmentStageValues = {
  'preclinical': '00-preclinical',
  'phase1': '10-phase1',
  'phase2': '20-phase2',
  'phase3': '30-phase3',
  'approved': '40-approved'
};


function parse_drugs() {

  const filename = path.join(__dirname, '..', 'data', 'drugs.csv');

  const file_data = fs.readFileSync(filename, 'utf8');

  const drugInfo = d3.csv.parse(file_data);
  const dataSets = parse_datasets();

  const drugs = drugInfo.map(function(d) {

    const drug = {
      id: d['HMS LINCS ID'],
      hmsLincsId: d['HMS LINCS ID'],
      name: labelValue(d['Name']),
      targetProtein: labelValue(d['Target - protein']),
      targetProteinClass: labelValue(d['Target - protein_class']),
      targetGene: labelValue(d['Target - gene']),
      targetRole: labelValue(d['Target - role']),
      targetPathway: labelValue(d['Target - pathway']),
      targetFunction: labelValue(d['Target - function']),
      developmentStage: labelValue(d['Class'], developmentStageValues),
      synonyms: _.compact(_.split(d['Synonyms'], ';')),
      searchIndexOnlyNames: _.compact(_.split(d['Search-index-only names'], ';'))
    };

    drug.dataset = [];
    dataSets.forEach(function(info) {
      // For each dataset, if the dataset had this drug in it. then add the
      // datset's id to this drug's dataset array.
      if(_.includes(info.drugs, drug.id)) {
        drug.dataset.push({value:info.id, label:info.label});
      }
    });

    return drug;

  });

  return drugs;
};


module.exports = parse_drugs;
