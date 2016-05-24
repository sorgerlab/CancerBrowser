import React from 'react';
import _ from 'lodash';
import MultiSelectFilter from '../MultiSelectFilter';
import SelectFilter from '../SelectFilter';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import boundCallback from '../../utils/boundCallback';
import * as ImmutableUtils from '../../utils/immutable_utils';
import './filter_panel.scss';

const propTypes = {
  /* filterGroups is of form:
    [
      {
        id: 'configure',
        label: 'Configure',
        filters: [
          {
            id: 'parameter',
            label: 'Parameter',
            type: 'select',
            values: [
              { value: 'perkFold', label: 'pERK Fold Change' },
              { value: 'paktFold', label: 'pAKT Fold Change' },
            ]
          }
        ]
      }, {
        id: 'cellLineFilters'
        label: 'Cell Line Filters',
        filters: ...
      }
    ];
   */
  filterGroups: React.PropTypes.array,

  /* activeFilters contains the active filters for each filter group. It is of the form
   * where each filterGroup id is a key mapping to an array of active filters:
    {
      configure: [{ id: 'parameter', values: ['perkFold'] }, ...(other active filter values)],
      cellLineFilters: []
    }
   */
  activeFilters: React.PropTypes.object,

  /*
   * The counts associated with filters, typically that match some query.
   * They are grouped by filter group then filter.
   * Optionally include the countMax key if the max value in the counts object
   * isn't what you want the max width to be set to.
   * e.g.
    [
      {
        id: 'cellLineFilters',
        counts: [{
          id: 'collection',
          counts: {
            big6: 6
            icbp43: 43
          },
          countMax: 49
        }, ...]
      }, ...
    ];
   */
  counts: React.PropTypes.array,

  // called whenever a filter changes
  onFilterChange: React.PropTypes.func
};

class FilterPanel extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.boundCallbacks = {};
  }

  handleFilterChange(filterId, groupId, newFilterValuesList) {
    const { activeFilters, onFilterChange } = this.props;

    // create a new object with this filter and its new values
    const newFilterValues = { id: filterId, values: newFilterValuesList };

    // find the active filters for the group
    let activeFiltersForGroup = activeFilters[groupId];
    let activeFiltersFilterIndex;

    // find the index of the filter inside the group's active filters
    if (activeFiltersForGroup) {
      activeFiltersFilterIndex = activeFiltersForGroup.findIndex(activeFilter => activeFilter.id === filterId);
    }

    // if we have no set values for this filter, remove it
    if (!newFilterValuesList.length) {
      if (activeFiltersForGroup) {
        // this was the only filter set, remove the whole group
        if (activeFiltersForGroup.length === 1) {
          activeFiltersForGroup = null;

        // there were multiple filters set, remove just this one
        } else {
          activeFiltersForGroup = ImmutableUtils.arrayRemove(activeFiltersForGroup, activeFiltersFilterIndex);
        }
      }

    // there are some values for this filter, so ensure it is updated or added
    } else {
      // group did not have values before, so create the group level initialized with this value
      if (!activeFiltersForGroup) {
        activeFiltersForGroup = [newFilterValues];

      // this group had values before
      } else {
        // replace the existing values
        if (activeFiltersFilterIndex !== -1) {
          activeFiltersForGroup = ImmutableUtils.arraySet(activeFiltersForGroup, activeFiltersFilterIndex, newFilterValues);

        // add new values
        } else {
          activeFiltersForGroup = activeFiltersForGroup.concat(newFilterValues);
        }
      }
    }

    let newActiveFilters;
    if (activeFiltersForGroup === null) {
      newActiveFilters = _.omit(activeFilters, groupId);
    } else {
      newActiveFilters = Object.assign({}, activeFilters, { [groupId]: activeFiltersForGroup });
    }

    if (onFilterChange) {
      onFilterChange(newActiveFilters);
    }

    console.log('[filter change]', newActiveFilters);
    return newActiveFilters;
  }

  renderMultiSelectFilter(filter, values, filterCounts, filterId, groupId) {
    const { options = {} } = filter;
    const { props } = options;
    const { counts, countMax } = (filterCounts || {});

    return (
      <MultiSelectFilter items={filter.values}
        values={values && values.values}
        onChange={boundCallback(this, this.boundCallbacks, this.handleFilterChange, filterId, groupId)}
        counts={counts} countMax={countMax}
        {...props} />
    );
  }

  renderSelectFilter(filter, values, filterCounts, filterId, groupId) {
    const { options = {} } = filter;
    const { props } = options;
    const { counts, countMax } = (filterCounts || {});


    let value;
    if (values && values.values) {
      value = values.values[0];
    }
    return (
      <SelectFilter items={filter.values}
        value={value}
        onChange={boundCallback(this, this.boundCallbacks, this.handleFilterChange, filterId, groupId)}
        counts={counts} countMax={countMax}
        {...props} />
    );
  }

  renderFilter(filter, values, counts, filterId, groupId, index) {
    let filterElem;

    switch (filter.type) {
      case 'multi-select':
        filterElem = this.renderMultiSelectFilter(filter, values, counts, filterId, groupId);
        break;
      case 'select':
        filterElem = this.renderSelectFilter(filter, values, counts, filterId, groupId);
        break;
    }

    if (!filterElem) {
      console.warn(`Unsupported filter type '${filter.type}' encountered in FilterPanel`, filter);
      return null;
    }

    return (
      <div key={index} className='filter-panel-filter'>
        <header>{filter.label}</header>
        <div>{filterElem}</div>
      </div>
    );
  }

  renderFilterGroup(group, index) {
    const { activeFilters, counts } = this.props;

    const activeFiltersForGroup = activeFilters[group.id];
    const filterGroupCounts = counts.find(groupCounts => groupCounts.id === group.id);

    return (
      <div key={index} className='filter-panel-group'>
        <header>{group.label}</header>
        <div className='filter-panel-filters'>
          {group.filters.map((filter, i) => {
            let filterValues, filterCounts;
            if (activeFiltersForGroup) {
              filterValues = activeFiltersForGroup.find(activeFilter => activeFilter.id === filter.id);
            }
            if (filterGroupCounts) {
              filterCounts = filterGroupCounts.counts.find(filterCounts => filterCounts.id === filter.id);
            }

            return this.renderFilter(filter, filterValues, filterCounts, filter.id, group.id, i);
          })}
        </div>
      </div>
    );
  }

  render() {
    const { filterGroups } = this.props;

    return (
      <div className="FilterPanel">
        {filterGroups.map((group, i) => {
          return this.renderFilterGroup(group, i);
        })}
      </div>
    );
  }
}

FilterPanel.propTypes = propTypes;

export default FilterPanel;
