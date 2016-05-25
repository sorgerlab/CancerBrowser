#!/usr/bin/env node

var fs = require('fs');
var d3 = require('d3');
var _  = require('lodash');

var filename = process.argv[2];

// TODO: specify output filename?
var outputFilename = './cell_lines.json';


function lowerFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

Object.prototype.renameProperty = function (oldName, newName) {
  // Do nothing if the names are the same
  if (oldName == newName) {
    return this;
  }
  // Check for the old property name to avoid a ReferenceError in strict mode.
  if (this.hasOwnProperty(oldName)) {
    this[newName] = this[oldName];
    delete this[oldName];
  }
  return this;
};
// BRCA1,BRCA2,CDH1,MAP3K1,MLL3,PIK3CA,PTEN,TP53,GATA3*,MAP2K4
var GENES = [
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
  var mutations = [];
  GENES.forEach(function(gene) {
    if(_.has(row, gene)) {
      var mutType = row[gene] ? row[gene].toLowerCase().replace(' ', '') : '';

      var mutation = gene.toLowerCase() + mutType;

      mutations.push({value: mutation, label: gene + ' ' + row[gene]});
    }
  });
  return mutations.sort(d3.ascending);
}

function getSubtypes(subtypeString) {
  if(subtypeString.toLowerCase() == 'no data') {
    return [];
  } else {
    return _.split(subtypeString,',').map((s) => {
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
      var newKey = k.replace('*', '');
      d.renameProperty(k, newKey);
      k = newKey;

      if(!_.includes(GENES, k)) {
        var originalValue = d[k];

        var newValue = d[k].toLowerCase();
        newValue = newValue.replace('+','plus');
        newValue = newValue.replace(' ','');
        //TODO: save if the mutation has an * somewhere, for display.
        newValue = newValue.replace('*', '');
        newKey = lowerFirstLetter(k);
        newKey = newKey.replace(' ','');
        d.renameProperty(k, newKey);
        d[newKey] = {value: newValue, label: originalValue};
      }
    });

    d.mutation = getMutations(d);
    d.molecularSubtype = getSubtypes(d.molecularSubtype.label);

    // pull up cellLine.value to be the ID
    d.id = d.cellLine.value;
  });
  fs.writeFileSync(outputFilename, JSON.stringify(data, null, 2));
});
