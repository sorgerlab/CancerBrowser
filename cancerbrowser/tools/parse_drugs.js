#!/usr/bin/env node

var fs = require('fs');
var d3 = require('d3');
var _  = require('lodash');

require('./utils');

function toCategories(string, delim) {
  return _.split(string, delim).map((s) => {
    return {label: _.trim(s), value:_.trim(s).replace(' ', '').toLowerCase()};
  });
}

var filename = process.argv[2];

// TODO: specify output filename?
var outputFilename = './drugs.json';

fs.readFile(filename, 'utf8', function(error, data) {
  data = d3.csv.parse(data);

  data.forEach(function(d) {

    Object.keys(d).forEach(function(k) {

      var newKey = k.toLowerCase();
      newKey = newKey.replace(/\s/g,'');
      newKey = newKey.replace(/-/g,'');
      d.renameProperty(k, newKey);

      var value = d[newKey];

      if(value) {
        var newValue = value.toLowerCase();

        d[newKey] = {value: newValue, label:value};
      } else {
        d[newKey] = {value: '', label: ''};
      }
    });

    d.searchindexonlynames = toCategories(d.searchindexonlynames.label, ';');
    d.id = d.name.value;
  });

  fs.writeFileSync(outputFilename, JSON.stringify(data, null, 2));
});
