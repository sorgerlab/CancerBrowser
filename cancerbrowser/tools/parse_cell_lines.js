#!/usr/bin/env node

var fs = require('fs');
var d3 = require('d3');

var filename = process.argv[2];

// TODO: specify output filename?
var outputFilename = './cell_lines.json';

fs.readFile(filename, 'utf8', function(error, data) {
  // TODO: remove white space from titles

  // TODO: remove '*' from titles and cells

  // TODO: mutations include 'NA' - what to do with that?

  data = d3.csv.parse(data);
  fs.writeFileSync(outputFilename, JSON.stringify(data, null, 2));
});
