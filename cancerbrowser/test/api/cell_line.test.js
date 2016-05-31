import { assert } from 'chai';

import {
  getCellLines,
  getCellLineInfo
} from '../../common/api/cell_line';

describe('CellLine API', function() {
  it('filters cell lines with one filterGroup', function() {
    var filterGroups = [
      [{id:'molecularSubtype', values:['basala']}]
    ];

    return getCellLines(filterGroups).then(function(results) {
      assert.equal(results.length, 10);
    });


  });

  it('filters cell lines with multilple filters', function() {
    var filterGroups = [
      [
        {id:'molecularSubtype', values:['basala']},
        {id:'mutation', values:['brca2mut']}
      ]
    ];

    return getCellLines(filterGroups).then(function(results) {
      assert.equal(results.length, 3);
    });


  });

  it('filters cell lines with multilple filterGroups', function() {
    var filterGroups = [
      [{id:'molecularSubtype', values:['basala']}],
      [{id:'mutation', values:['brca2mut']}]
    ];

    return getCellLines(filterGroups).then(function(results) {
      assert.equal(results.length, 3);
    });


  });
});

describe('CellLineInfo API', function() {
  it('gets info for a particular cell line', function() {

    // let cellLineId = 'bt-20';

    // return getCellLineInfo(cellLineId).then(function(results) {
    //   assert.equal(results.length, 3);
    // });


  });
});
