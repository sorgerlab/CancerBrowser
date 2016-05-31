#!/usr/bin/env node
/*
 Sample output:
  [{
    hmsLincsId: '10001-101',
    name: { value: 'someName', label: 'Some Name' },
    nominalTarget: { value: 'someTarget', label: 'Some Target' },
    parentTargets: ['someOtherTargetValue', 'someOtherParentTargetValue', ...],
    class: { value: 'phase1', label: 'Phase 1 '},
    synonyms: ['someName', 'someOtherName', ...],
    searchIndexOnlyNames: ['hiddenName', 'hiddenOtherName', ...],
  }, ...]
*/

var fs = require('fs');
var d3 = require('d3');
var _  = require('lodash');
require('./utils');


function normalize(str) {
  return _.trim(str).replace(/[\s-]/g, '').toLowerCase();
}

function labelValue(str) {
  const trimmed = _.trim(str);

  if (trimmed.length === 0) {
    return null;
  }

  return {
    label: trimmed,
    value: normalize(str)
  };
}

var filename = process.argv[2];

// TODO: specify output filename?
var outputFilename = './drugs.json';

fs.readFile(filename, 'utf8', function(error, data) {
  data = d3.csv.parse(data);

  const transformed = data.map(function(d) {
    return {
      id: d['HMS LINCS ID'],
      hmsLincsId: d['HMS LINCS ID'],
      name: labelValue(d['Name']),
      nominalTarget: labelValue(d['Nominal target / Pathway']),
      parentTargets: [],
      class: labelValue(d['Class']),
      synonyms: _.compact(_.split(d['Synonyms'], ';')),
      searchIndexOnlyNames: _.compact(_.split(d['Search-index-only names'], ';'))
    };
  });

  fs.writeFileSync(outputFilename, JSON.stringify(transformed, null, 2));
});
