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
    {
      cellLineFilters: {
        collection: {
          counts: {
            big6: 6
            icbp43: 43
          },
          countMax: 49
        },
        ... (other filters)
      },
      ... (other filter groups)
    }
   */
  counts: React.PropTypes.object,

  // called whenever a filter changes
  onFilterChange: React.PropTypes.func
};

class FilterPanel extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.boundCallbacks = {};
  }

  /**
   * Callback for when filters change. Handles updating the filter values
   * then fires onFilterChange with the new activeFilters object
   *
   * @param {String} filterId The ID of the filter (e.g., 'collection')
   * @param {String} groupId The ID of the filter group (e.g., 'cellLineFilters')
   * @param {Array} newFilterValuesList The array of new values for the given filter
   * @return {Object} The new activeFilters object.
   */
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

    // Integrate the updated filter group into the other activeFilters
    let newActiveFilters;
    if (activeFiltersForGroup === null) {
      newActiveFilters = _.omit(activeFilters, groupId);
    } else {
      newActiveFilters = Object.assign({}, activeFilters, { [groupId]: activeFiltersForGroup });
    }

    // fire the callback
    if (onFilterChange) {
      onFilterChange(newActiveFilters);
    }

    console.log('[filter change]', newActiveFilters);
    return newActiveFilters;
  }

  /**
   * Renders a multiselect filter for filtering by multiple values
   *
   * @param {Object} filter The filter being rendered (e.g. { id: 'collection', values: [...]})
   * @param {Array} activeValues The values actively set in the filter
   * @param {Object} filterCounts The counts information for the filter (e.g. { counts: { big6: 6 }, countMax: 9 })
   * @param {String} groupId The ID of the filter group
   */
  renderMultiSelectFilter(filter, activeValues, filterCounts, groupId) {
    const { options = {}, id: filterId } = filter;
    const { props } = options;
    const { counts, countMax } = (filterCounts || {});

    return (
      <MultiSelectFilter items={filter.values}
        values={activeValues}
        onChange={boundCallback(this, this.boundCallbacks, this.handleFilterChange, filterId, groupId)}
        counts={counts} countMax={countMax}
        {...props} />
    );
  }

  /**
   * Renders a select filter for filtering by a single value
   *
   * @param {Object} filter The filter being rendered (e.g. { id: 'collection', values: [...]})
   * @param {Array} activeValues The values actively set in the filter
   * @param {Object} filterCounts The counts information for the filter (e.g. { counts: { big6: 6 }, countMax: 9 })
   * @param {String} groupId The ID of the filter group
   */
  renderSelectFilter(filter, activeValues, filterCounts, groupId) {
    const { options = {}, id: filterId } = filter;
    const { props } = options;
    const { counts, countMax } = (filterCounts || {});

    // this filter only has a single value
    let value;
    if (activeValues) {
      value = activeValues[0];
    }

    return (
      <SelectFilter items={filter.values}
        value={value}
        onChange={boundCallback(this, this.boundCallbacks, this.handleFilterChange, filterId, groupId)}
        counts={counts} countMax={countMax}
        {...props} />
    );
  }

  /**
   * Renders a filter based on the type of the filter
   *
   * @param {Object} filter The filter being rendered (e.g. { id: 'collection', values: [...]})
   * @param {Object} activeValuesObj The values object from the active filter
   * @param {Object} filterCounts The counts information for the filter (e.g. { counts: { big6: 6 }, countMax: 9 })
   * @param {String} groupId The ID of the filter group
   */
  renderFilter(filter, activeValuesObj, filterCounts, groupId, index) {
    let filterElem;

    // we only need the array of values, not the whole obj since we have the filter obj itself
    const activeValues = activeValuesObj && activeValuesObj.values;

    switch (filter.type) {
      case 'multi-select':
        filterElem = this.renderMultiSelectFilter(filter, activeValues, filterCounts, groupId);
        break;
      case 'select':
        filterElem = this.renderSelectFilter(filter, activeValues, filterCounts, groupId);
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

  /**
   * Renders a labeled group of filters
   *
   * @param {Object} group The filter group being rendered (e.g. { id: 'cellLineFilters', filters: [...]})
   * @param {Number} index The index of the group in filterGroups
   */
  renderFilterGroup(group, index) {
    const { activeFilters, counts } = this.props;

    const activeFiltersForGroup = activeFilters[group.id];
    const countsForGroup = counts[group.id];

    return (
      <div key={index} className='filter-panel-group'>
        <header>{group.label}</header>
        <div className='filter-panel-filters'>
          {group.filters.map((filter, i) => {
            let activeValues, filterCounts;

            if (activeFiltersForGroup) {
              activeValues = activeFiltersForGroup.find(activeFilter => activeFilter.id === filter.id);
            }
            if (countsForGroup) {
              filterCounts = countsForGroup[filter.id];
            }

            return this.renderFilter(filter, activeValues, filterCounts, filter.id, group.id, i);
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
