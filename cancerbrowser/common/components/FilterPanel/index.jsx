import React from 'react';
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

  /* activeFilters contains the active filters for each filter group. It is of the form:
    [
      {
        id: 'configure',
        activeFilters: [{ id: 'parameter', values: ['perkFold'] }]
      },
      ... (next filter group)
    ];
   */
  activeFilters: React.PropTypes.array,

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

  handleFilterChange(filterIndex, groupIndex, newFilterValuesList) {
    const { filterGroups, activeFilters, onFilterChange } = this.props;

    // kind of clunky, since the props values index doesn't match with filterGroups index
    const filterGroup = filterGroups[groupIndex];
    const { id: groupId } = filterGroup;
    const { id: filterId } = filterGroup.filters[filterIndex];

    // create a new object with this filter and its new values
    const newFilterValues = { id: filterId, values: newFilterValuesList };

    // find the active filters for the group
    const activeFiltersForGroupIndex = activeFilters.findIndex(groupValues => groupValues.id === groupId);
    let activeFiltersForGroup = activeFiltersForGroupIndex === -1 ? undefined : activeFilters[activeFiltersForGroupIndex];
    let activeFiltersFilterIndex;

    // find the index of the filter inside the group's active filters
    if (activeFiltersForGroup) {
      activeFiltersFilterIndex = activeFiltersForGroup.activeFilters.findIndex(activeFilter => activeFilter.id === filterId);
    }

    // if we have no set values for this filter, remove it
    if (!newFilterValuesList.length) {
      if (activeFiltersForGroup) {
        // this was the only filter set, remove the whole group
        if (activeFiltersForGroup.activeFilters.length === 1) {
          activeFiltersForGroup = null;

        // there were multiple filters set, remove just this one
        } else {
          activeFiltersForGroup = {
            id: groupId,
            values: ImmutableUtils.arrayRemove(activeFiltersForGroup.activeFilters, activeFiltersFilterIndex)
          };
        }
      }

    // there are some values for this filter, so ensure it is updated or added
    } else {
      // group did not have values before, so create the group level initialized with this value
      if (!activeFiltersForGroup) {
        activeFiltersForGroup = { id: groupId, activeFilters: [newFilterValues] };

      // this group had values before
      } else {
        // replace the existing values
        if (activeFiltersFilterIndex !== -1) {
          activeFiltersForGroup = {
            id: groupId,
            activeFilters: ImmutableUtils.arraySet(activeFiltersForGroup.activeFilters, activeFiltersFilterIndex, newFilterValues)
          };

        // add new values
        } else {
          activeFiltersForGroup = { id: groupId, activeFilters: activeFiltersForGroup.activeFilters.concat(newFilterValues) };
        }
      }
    }

    let newValues;
    if (activeFiltersForGroup === null) {
      newValues = ImmutableUtils.arrayRemove(activeFilters, activeFiltersForGroupIndex);
    } else if (activeFiltersForGroupIndex === -1) {
      newValues = activeFilters.concat(activeFiltersForGroup);
    } else {
      newValues = ImmutableUtils.arraySet(activeFilters, activeFiltersForGroupIndex, activeFiltersForGroup);
    }

    // TODO: fire filter change action with newValues
    if (onFilterChange) {
      onFilterChange(newValues);
    }

    console.log('[filter change]', newValues);
    return newValues;
  }

  renderMultiSelectFilter(filter, values, filterCounts, index, groupIndex) {
    const { options = {} } = filter;
    const { props } = options;
    const { counts, countMax } = (filterCounts || {});

    return (
      <MultiSelectFilter items={filter.values}
        values={values && values.values}
        onChange={boundCallback(this, this.boundCallbacks, this.handleFilterChange, index, groupIndex)}
        counts={counts} countMax={countMax}
        {...props} />
    );
  }

  renderSelectFilter(filter, values, filterCounts, index, groupIndex) {
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
        onChange={boundCallback(this, this.boundCallbacks, this.handleFilterChange, index, groupIndex)}
        counts={counts} countMax={countMax}
        {...props} />
    );
  }

  renderFilter(filter, values, counts, index, groupIndex) {
    let filterElem;

    switch (filter.type) {
      case 'multi-select':
        filterElem = this.renderMultiSelectFilter(filter, values, counts, index, groupIndex);
        break;
      case 'select':
        filterElem = this.renderSelectFilter(filter, values, counts, index, groupIndex);
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

    const activeFiltersForGroup = activeFilters.find(groupValues => groupValues.id === group.id);
    const filterGroupCounts = counts.find(groupCounts => groupCounts.id === group.id);

    return (
      <div key={index} className='filter-panel-group'>
        <header>{group.label}</header>
        <div className='filter-panel-filters'>
          {group.filters.map((filter, i) => {
            let filterValues, filterCounts;
            if (activeFiltersForGroup) {
              filterValues = activeFiltersForGroup.activeFilters.find(activeFilter => activeFilter.id === filter.id);
            }
            if (filterGroupCounts) {
              filterCounts = filterGroupCounts.counts.find(filterCounts => filterCounts.id === filter.id);
            }

            return this.renderFilter(filter, filterValues, filterCounts, i, index);
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
