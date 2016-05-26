#!/usr/bin/env node

var fs = require('fs');
var d3 = require('d3');
var _  = require('lodash');


var filename = process.argv[2];

var data = require('./' + filename);

var keys = Object.keys(data[0]);

keys.forEach(function(key) {
  var values = data.map(d => d[key]);
  var uniqueValues  = _.uniqBy(values, 'value');
  console.log(key)
  console.log(uniqueValues)
});
