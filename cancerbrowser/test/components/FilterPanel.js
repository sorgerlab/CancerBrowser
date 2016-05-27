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
    assert.equal(modifiedFilters[groupId][0].values, newFilterValuesList);
  });
});
