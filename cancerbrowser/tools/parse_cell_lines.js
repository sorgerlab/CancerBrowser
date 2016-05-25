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
      var mutType = row[gene] == 'MUT' ? 'mut' : 'wt';
      var mutation = gene.toLowerCase() + mutType;

      mutations.push(mutation);
    }
  });
  return mutations;
}

function getSubtypes(subtypeString) {
  if(subtypeString.toLowerCase() == 'no data') {
    return [];
  } else {
    return _.split(subtypeString,',').map((s) => {
      return _.trim(s).replace(' ', '').toLowerCase();
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
        var newValue = d[k].toLowerCase();
        newValue = newValue.replace('+','plus');
        newValue = newValue.replace(' ','');
        //TODO: save if the mutation has an * somewhere, for display.
        newValue = newValue.replace('*', '');
        newKey = lowerFirstLetter(k);
        newKey = newKey.replace(' ','');
        d.renameProperty(k, newKey);
        d[newKey] = newValue;
      }

    });

    d.mutation = getMutations(d);
    d.molecularSubtype = getSubtypes(d.molecularSubtype);
  });
  fs.writeFileSync(outputFilename, JSON.stringify(data, null, 2));
});
