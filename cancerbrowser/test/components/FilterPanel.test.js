import { assert } from 'chai';

import FilterPanel from '../../common/components/FilterPanel';

describe('FilterPanel handleFilterChange', function() {
  it('adds a new filter when there are none in any group', function() {
    const initialFilters = {};
    const filterId = 'myFilter';
    const groupId = 'myGroup';
    const newFilterValuesList = ['value1'];

    const filterPanel = new FilterPanel({ activeFilters: initialFilters });
    const modifiedFilters = filterPanel.handleFilterChange(filterId, groupId, newFilterValuesList);

    assert.lengthOf(Object.keys(modifiedFilters), 1); // myGroup only
    assert.lengthOf(modifiedFilters[groupId], 1); // myFilter only

    // has the same value as passed in
    assert.equal(modifiedFilters[groupId][0].values, newFilterValuesList);
  });

  it('adds a new filter when there is one in this group', function() {
    const initialFilters = {
      myGroup: [{ id: 'myOtherFilter', values: ['value']}]
    };
    const filterId = 'myFilter';
    const groupId = 'myGroup';
    const newFilterValuesList = ['value1'];

    const filterPanel = new FilterPanel({ activeFilters: initialFilters });
    const modifiedFilters = filterPanel.handleFilterChange(filterId, groupId, newFilterValuesList);

    assert.lengthOf(Object.keys(modifiedFilters), 1); // myGroup only
    assert.lengthOf(modifiedFilters[groupId], 2); // myFilter + myOtherFilter

    // has the same value as passed in
    assert.equal(modifiedFilters[groupId][1].values, newFilterValuesList);
  });

  it('adds a new filter when there is one in a different group', function() {
    const initialFilters = {
      myOtherGroup: [{ id: 'myOtherFilter', values: ['value']}]
    };
    const filterId = 'myFilter';
    const groupId = 'myGroup';
    const newFilterValuesList = ['value1'];

    const filterPanel = new FilterPanel({ activeFilters: initialFilters });
    const modifiedFilters = filterPanel.handleFilterChange(filterId, groupId, newFilterValuesList);

    assert.lengthOf(Object.keys(modifiedFilters), 2); // myGroup + myOtherGroup
    assert.lengthOf(modifiedFilters[groupId], 1); // myFilter only

    // has the same value as passed in
    assert.equal(modifiedFilters[groupId][0].values, newFilterValuesList);
  });

  it('updates a filter value', function() {
    const initialFilters = {
      myGroup: [{ id: 'myFilter', values: ['value']}]
    };
    const filterId = 'myFilter';
    const groupId = 'myGroup';
    const newFilterValuesList = ['value', 'value1'];

    const filterPanel = new FilterPanel({ activeFilters: initialFilters });
    const modifiedFilters = filterPanel.handleFilterChange(filterId, groupId, newFilterValuesList);

    assert.lengthOf(Object.keys(modifiedFilters), 1); // myGroup only
    assert.lengthOf(modifiedFilters[groupId], 1); // myFilter only
    assert.lengthOf(modifiedFilters[groupId][0].values, 2); // has both values

    // has the same value as passed in
    assert.equal(modifiedFilters[groupId][0].values, newFilterValuesList);
    assert.lengthOf(initialFilters.myGroup[0].values, 1); // not mutated initial data
  });

  it('removes a filter when only one in group', function() {
    const initialFilters = {
      myGroup: [{ id: 'myFilter', values: ['value']}]
    };
    const filterId = 'myFilter';
    const groupId = 'myGroup';
    const newFilterValuesList = [];

    const filterPanel = new FilterPanel({ activeFilters: initialFilters });
    const modifiedFilters = filterPanel.handleFilterChange(filterId, groupId, newFilterValuesList);

    assert.lengthOf(Object.keys(modifiedFilters), 0); // nothing left
  });

  it('removes a filter when many in same group', function() {
    const initialFilters = {
      myGroup: [{ id: 'myOtherFilter', values: ['value']}, { id: 'myFilter', values: ['value']}]
    };
    const filterId = 'myFilter';
    const groupId = 'myGroup';
    const newFilterValuesList = [];

    const filterPanel = new FilterPanel({ activeFilters: initialFilters });
    const modifiedFilters = filterPanel.handleFilterChange(filterId, groupId, newFilterValuesList);

    assert.lengthOf(Object.keys(modifiedFilters), 1); // myGroup still
    assert.lengthOf(modifiedFilters[groupId], 1); // myOtherFilter only
    assert.equal(modifiedFilters[groupId][0].id, 'myOtherFilter');
  });
});
