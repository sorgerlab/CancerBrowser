import { assert } from 'chai';

// import _ from 'lodash';

import {
  mergeData
} from '../../common/api/util';


describe('API Util - Merge', function() {
  it('merges data', function() {

    let left = [{key: 'a', val: '123'}];
    let right = [{rkey: 'a', 'val': 'abc' }];

    let result = mergeData(left, right, 'key', 'rkey', 'info');

    assert.equal(left.info, undefined);

    assert.equal(result.length, 1);

    let val = result[0];
    assert.equal(val.info.val, 'abc');

  });

  it('merges data for multiple rows', function() {
    let left = [
      {key: 'a', val: '123'},
      {key: 'b', val: '123'},
      {key: 'c', val: '123'}
    ];

    let right = [
      {rkey: 'c', 'val': 'xyz' },
      {rkey: 'a', 'val': 'abc' }
    ];

    let result = mergeData(left, right, 'key', 'rkey', 'info');
    assert.equal(result.length, 3);

    assert.equal(result[0].info.val, 'abc');
    assert.equal(result[1].info.val, undefined);
    assert.equal(result[2].info.val, 'xyz');
  });

  it('handles function accessors', function() {
    let left = [
      {key: 'A', val: '123'},
      {key: 'B', val: '123'},
      {key: 'C', val: '123'}
    ];

    let right = [
      {rkey: 'c', 'val': 'xyz' },
      {rkey: 'a', 'val': 'abc' }
    ];

    let result = mergeData(left, right, (d) => d.key.toLowerCase(), 'rkey', 'info');
    assert.equal(result.length, 3);

    assert.equal(result[0].info.val, 'abc');
    assert.equal(result[1].info.val, undefined);
    assert.equal(result[2].info.val, 'xyz');

  });

  it('handles duplicate leftdata keys', function() {
    let left = [
      {key: 'a', val: '123'},
      {key: 'a', val: '123'},
      {key: 'c', val: '123'}
    ];
    let right = [
      {rkey: 'c', 'val': 'xyz' },
      {rkey: 'a', 'val': 'abc' }
    ];

    let result = mergeData(left, right, 'key', 'rkey', 'info');
    assert.equal(result.length, 3);

    assert.equal(result[0].info.val, 'abc');
    assert.equal(result[1].info.val, 'abc');
    assert.equal(result[2].info.val, 'xyz');
  });
});
