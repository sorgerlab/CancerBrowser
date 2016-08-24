#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const parse_cell_lines = require('./parse_cell_lines.js');
//const parse_drugs = require('./parse_drugs.js');

const OUTPUT_PATH = path.join(__dirname, '..', 'common', 'api', 'data');

function writeFile(data, outputFilename) {
  const filename = path.join(OUTPUT_PATH, outputFilename);
  return fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

writeFile(parse_cell_lines(), 'cell_lines.json');
//writeFile(parse_drugs(), 'drugs.json');
