#!/usr/bin/env node
'use strict';

const fs = require('fs');
const d3 = require('d3');
const _  = require('lodash');

const utils = require('./utils');

// import { normalize } from '../common/utils/string_utils';

const filename = process.argv[2];

// TODO: specify output filename?
const outputFilename = './cell_lines.json';


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


fs.readFile(filename, 'utf8', function(error, data) {

  // TODO: remove '*' from titles and cells

  // TODO: mutations include 'No data' - what to do with that?

  data = d3.csv.parse(data);

  data.forEach(function(d) {

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
  });
  fs.writeFileSync(outputFilename, JSON.stringify(data, null, 2));
});
