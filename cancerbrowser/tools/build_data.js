#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const path = require('path');

const parse_cell_lines = require('./parse_cell_lines.js');
const parse_drugs = require('./parse_drugs.js');

const INPUT_PATH = path.join(__dirname, '..', 'data')
const OUTPUT_PATH = path.join(__dirname, '..', 'common', 'assets', 'data');

function writeFile(data, outputFilename) {
  const filename = path.join(OUTPUT_PATH, outputFilename);
  return fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

function copyPath(p) {
  const inputPath = path.join(INPUT_PATH, p);
  const outputPath = path.join(OUTPUT_PATH, p);
  return fs.copySync(inputPath, outputPath);
}

try {
    fs.mkdirSync(OUTPUT_PATH);
} catch (err) {
    if (err.code !== 'EEXIST') {
        throw err;
    }
}

writeFile(parse_cell_lines(), 'cell_lines.json');
writeFile(parse_drugs(), 'drugs.json');
copyPath('datasets.json');
copyPath('datasets');
