import { assert } from 'chai';

import {
  getCellLines
} from '../../common/api/cell_line';

describe('CellLine API', function() {
  it('filters cell lines with one filterGroup', function() {
    var filterGroups = [
      [{id:'MolecularSubtype', values:['Basal A']}]
    ];

    var results = getCellLines(filterGroups);

    assert.equal(results.length, 10);

  });

  it('filters cell lines with multilple filters', function() {
    var filterGroups = [
      [
        {id:'MolecularSubtype', values:['Basal A']},
        {id:'BRCA2', values:['MUT']}
      ]
    ];

    var results = getCellLines(filterGroups);

    assert.equal(results.length, 3);

  });

  it('filters cell lines with multilple filterGroups', function() {
    var filterGroups = [
      [{id:'MolecularSubtype', values:['Basal A']}],
      [{id:'BRCA2', values:['MUT']}]
    ];

    var results = getCellLines(filterGroups);

    assert.equal(results.length, 3);

  });
});
