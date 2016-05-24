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

  /* values is of form:
    [
      {
        id: 'configure',
        values: [{ id: 'parameter', values: ['perkFold'] }]
      }
    ];
   */
  values: React.PropTypes.array,

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
    const { filterGroups, values, onFilterChange } = this.props;

    // kind of clunky, since the props values index doesn't match with filterGroups index
    const filterGroup = filterGroups[groupIndex];
    const { id: groupId } = filterGroup;
    const { id: filterId } = filterGroup.filters[filterIndex];

    // create a new object with this filter and its new values
    const newFilterValues = { id: filterId, values: newFilterValuesList };

    // find the filter values for the group
    const filterGroupValuesIndex = values.findIndex(groupValues => groupValues.id === groupId);
    let filterGroupValues = filterGroupValuesIndex === -1 ? undefined : values[filterGroupValuesIndex];
    let filterValuesIndex;

    // find the index of the filter inside the group values
    if (filterGroupValues) {
      filterValuesIndex = filterGroupValues.values.findIndex(value => value.id === filterId);
    }

    // if we have no set values for this filter, remove it
    if (!newFilterValuesList.length) {
      if (filterGroupValues) {
        // this was the only filter set, remove the whole group
        if (filterGroupValues.values.length === 1) {
          filterGroupValues = null;

        // there were multiple filters set, remove just this one
        } else {
          filterGroupValues = {
            id: groupId,
            values: ImmutableUtils.arrayRemove(filterGroupValues.values, filterValuesIndex)
          };
        }
      }

    // there are some values for this filter, so ensure it is updated or added
    } else {
      // group did not have values before, so create the group level initialized with this value
      if (!filterGroupValues) {
        filterGroupValues = { id: groupId, values: [newFilterValues] };

      // this group had values before
      } else {
        // replace the existing values
        if (filterValuesIndex !== -1) {
          filterGroupValues = {
            id: groupId,
            values: ImmutableUtils.arraySet(filterGroupValues.values, filterValuesIndex, newFilterValues)
          };

        // add new values
        } else {
          filterGroupValues = { id: groupId, values: filterGroupValues.values.concat(newFilterValues) };
        }
      }
    }

    let newValues;
    if (filterGroupValues === null) {
      newValues = ImmutableUtils.arrayRemove(values, filterGroupValuesIndex);
    } else if (filterGroupValuesIndex === -1) {
      newValues = values.concat(filterGroupValues);
    } else {
      newValues = ImmutableUtils.arraySet(values, filterGroupValuesIndex, filterGroupValues);
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
    const { values, counts } = this.props;

    const filterGroupValues = values.find(groupValues => groupValues.id === group.id);
    const filterGroupCounts = counts.find(groupCounts => groupCounts.id === group.id);

    return (
      <div key={index} className='filter-panel-group'>
        <header>{group.label}</header>
        <div className='filter-panel-filters'>
          {group.filters.map((filter, i) => {
            let filterValues, filterCounts;
            if (filterGroupValues) {
              filterValues = filterGroupValues.values.find(filterValues => filterValues.id === filter.id);
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
