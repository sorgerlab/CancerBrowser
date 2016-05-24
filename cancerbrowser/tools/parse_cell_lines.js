#!/usr/bin/env node

var fs = require('fs');
var d3 = require('d3');
var _  = require('lodash');

var filename = process.argv[2];

// TODO: specify output filename?
var outputFilename = './cell_lines.json';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
  return mutations
}


fs.readFile(filename, 'utf8', function(error, data) {
  // TODO: remove white space from titles

  // TODO: remove '*' from titles and cells

  // TODO: mutations include 'NA' - what to do with that?

  data = d3.csv.parse(data);

  data.forEach(function(d) {

    Object.keys(d).forEach(function(k) {

      if(!_.includes(GENES, k)) {

        var newValue = d[k].toLowerCase();
        newValue = newValue.replace('+','plus');
        newValue = newValue.replace(' ','');
        var newKey = lowerFirstLetter(k);
        d.renameProperty(k, newKey);
        d[newKey] = newValue;

        d.mutation = getMutations(d);

      }

    });

  });
  fs.writeFileSync(outputFilename, JSON.stringify(data, null, 2));
});
