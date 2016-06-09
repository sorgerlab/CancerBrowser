import { assert } from 'chai';

// import _ from 'lodash';

import {
  filterData
} from '../../common/api/util';


describe('API Util', function() {
  it('filters data with string attributes ', function() {

    const data = [
      {id:'first', attribute: {value: 'correct'}},
      {id:'second', attribute: {value: 'incorrect'}},
      {id:'third', attribute: {value: 'valid'}}
    ];

    const filters = [
      {id:'attribute', values:['correct', 'valid', 'yes']}
    ];

    const results = filterData(data, filters);
    assert.equal(results.length, 2);
    assert.equal(results[0].id, 'first');
    assert.equal(results[1].id, 'third');
  });

  it('filters data with array attributes ', function() {

    const data = [
      {id:'first', attribute:[{value:'incorrect'}]},
      {id:'second', attribute:[{value:'correct'}, {value:'another'}]},
      {id:'third', attribute:{value:'valid'}}
    ];

    const filters = [
      {id:'attribute', values:['correct', 'valid']}
    ];

    const results = filterData(data, filters);
    assert.equal(results.length, 2);
    assert.equal(results[0].id, 'second');
    assert.equal(results[1].id, 'third');
  });

  it('filters with multiple filter groups', function() {

    const data = [
      {id:'first', attribute:[{value:'incorrect'}], location:{value:'london'}},
      {id:'second', attribute:[{value:'correct'}, {value:'another'}], location:{value:'new york'}},
      {id:'third', attribute:{value:'valid'}, location:{value:'paris'}}
    ];

    const filters = [
      {id:'attribute', values:['correct', 'valid']},
      {id:'location', values:['new york']}

    ];

    const results = filterData(data, filters);
    assert.equal(results.length, 1);
    assert.equal(results[0].id, 'second');
  });

  it('doesnt filter data when no filter or filter is empty', function() {
    const data = [
      {id:'first', attribute:[{value:'incorrect'}]},
      {id:'second', attribute:[{value:'correct'}, {value:'another'}]},
      {id:'third', attribute:{value:'valid'}}
    ];
    let results = filterData(data);
    assert.equal(results.length, 3);

    results = filterData(data, []);
    assert.equal(results.length, 3);
  });

  it('filters data when attribute not present on data', function() {
    const data = [
      {id:'first', attribute:[{value:'incorrect'}]},
      {id:'second', notattribute:[{value:'correct'}, {value:'another'}]},
      {id:'third', attribute:{value:'valid'}}
    ];

    const filters = [
      {id:'attribute', values:['correct', 'valid']}
    ];

    const results = filterData(data, filters);

    assert.equal(results.length, 1);
    assert.equal(results[0].id, 'third');
  });

});
