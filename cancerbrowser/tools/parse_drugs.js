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

function labelValue(str, valueOverrides) {
  var label = _.trim(str);

  if (label.length === 0) {
    return null;
  }

  var value = normalize(str);

  if (valueOverrides && valueOverrides[value]) {
    value = valueOverrides[value];
  }

  return { label, value };
}

// overrides to the value that enable proper sort with no effort
const classValues = {
  'preclinical': '00-preclinical',
  'phase1': '10-phase1',
  'phase2': '20-phase2',
  'phase3': '30-phase3',
  'approved': '40-approved'
};

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
      class: labelValue(d['Class'], classValues),
      synonyms: _.compact(_.split(d['Synonyms'], ';')),
      searchIndexOnlyNames: _.compact(_.split(d['Search-index-only names'], ';'))
    };
  });

  fs.writeFileSync(outputFilename, JSON.stringify(transformed, null, 2));
});
