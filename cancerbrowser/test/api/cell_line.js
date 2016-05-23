import { assert } from 'chai';

import {
  getCellLines
} from '../../common/api/cell_line';

describe('CellLine API', function() {
  it('filters cell lines ', function() {
    var filters = [
      {id:'MolecularSubtype', values:['Basal A']}
    ];

    var results = getCellLines(filters);

    assert.equal(results.length, 10);

  });
});
