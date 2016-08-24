'use strict';

const fs = require('fs');
const path = require('path');
const d3 = require('d3');
const _  = require('lodash');

const utils = require('./utils');
const parse_datasets = require('./parse_datasets');

// BRCA1,BRCA2,CDH1,MAP3K1,MLL3,PIK3CA,PTEN,TP53,GATA3*,MAP2K4
const GENES = [
  'BRCA1',
  'BRCA2',
  'CDH1',
  'MAP3K1',
  'MLL3',
  'PIK3CA',
  'PTEN',
  'TP53',
  'GATA3',
  'MAP2K4'
];

function getMutations(row) {
  const mutations = [];
  GENES.forEach(function(gene) {
    if(_.has(row, gene)) {
      const mutType = row[gene] ? row[gene].toLowerCase().replace(' ', '') : '';

      const mutation = gene.toLowerCase() + mutType;

      mutations.push({value: mutation, label: gene + ' ' + row[gene]});
    }
  });
  return mutations.sort(d3.ascending);
}


function getSubtypes(subtypeString, delim) {
  if(subtypeString.toLowerCase() === 'no data') {
    return [];
  } else {
    return _.split(subtypeString, delim).map((s) => {
      return {label: _.trim(s), value:_.trim(s).replace(' ', '').toLowerCase()};
    });
  }
}


function parse_cell_lines() {

  const filename = path.join(__dirname, '..', 'data', 'cell_lines.csv');

  const file_data = fs.readFileSync(filename, 'utf8');

  // TODO: remove '*' from titles and cells

  // TODO: mutations include 'No data' - what to do with that?

  const cellLines = d3.csv.parse(file_data);
  const dataSets = parse_datasets();

  cellLines.forEach(function(d) {

    Object.keys(d).forEach(function(k) {
      let newKey = k.replace('*', '');
      d.renameProperty(k, newKey);
      k = newKey;

      if(!_.includes(GENES, k)) {
        const originalValue = d[k];

        let newValue = d[k].toLowerCase();
        newValue = newValue.replace('+','plus');
        newValue = newValue.replace(/\s/g,'');
        newValue = newValue.replace(/,/g,'');
        //TODO: save if the mutation has an * somewhere, for display.
        newValue = newValue.replace('*', '');
        newKey = utils.lowerFirstLetter(k);
        newKey = newKey.replace(' ','');
        d.renameProperty(k, newKey);
        d[newKey] = {value: newValue, label: originalValue};
      }
    });

    d.mutation = getMutations(d);
    d.collection = getSubtypes(d.collection.label, ';');

    // pull up cellLine.value to be the ID
    d.id = utils.getId(d.cellLine.label);
    d.cellLine.value = utils.getId(d.cellLine.label);

    d.dataset = [];
    dataSets.forEach(function(info) {
      // For each dataset, if the dataset had this cell line in it. then add the
      // datset's id to this cell line's dataset array.
      if(_.includes(info.cellLines, d.id)) {
        d.dataset.push({value:info.id, label:info.label});
      }
    });

  });

  return cellLines;
}


module.exports = parse_cell_lines;
