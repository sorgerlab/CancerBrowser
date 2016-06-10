import React from 'react';
import { Icon } from 'react-fa';
import shallowCompare from 'react-addons-shallow-compare';
import createCachedPartial from '../../utils/createCachedPartial';
import * as ImmutableUtils from '../../utils/immutable_utils';
import './filter_group_summary.scss';

const propTypes = {
  /* filterGroup is of form:
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
    }
   */
  filterGroup: React.PropTypes.object,

  /* activeFilters contains the active filters for the filter group. e.g.
    [{ id: 'parameter', values: ['perkFold'] }, ...(other active filter values)]
   */
  activeFilters: React.PropTypes.array,

  // called whenever a filter changes
  onFilterChange: React.PropTypes.func
};

/**
 * Component for displaying a filter group
 */
class FilterGroupSummary extends React.Component {
  constructor(props) {
    super(props);
    this.partial = createCachedPartial(this);
  }

  /**
   * Life cycle method to check if component needs to be updated
   */
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  /**
   * Resets an active filter
   *
   * @param {Number} activeFilterIndex the index of the filter in activeFilters prop
   * @return {Array} the new active filters
   */
  handleResetFilter(activeFilterIndex) {
    const { activeFilters, onFilterChange } = this.props;

    const newActiveFilters = ImmutableUtils.arrayRemove(activeFilters, activeFilterIndex);
    if (onFilterChange) {
      onFilterChange(newActiveFilters);
    }

    return newActiveFilters;
  }

  /**
   * Renders a filter
   *
   * @param {Object} activeFilter The active filter to render
   * @param {Object} filter The filter definition to use for labels
   * @param {Number} index the index of the filter in activeFilters prop
   *
   * @return {React.Component}
   */
  renderFilter(activeFilter, filter, index) {
    const activeValueLabels = activeFilter.values.map(value => {
      const filterValue = filter.values.find(v => v.value === value);
      return filterValue ? filterValue.label : value;
    });
    const valueString = activeValueLabels.join(', ');

    return (
      <div key={index} className='active-filter'>
        <span className='filter-label'>{filter.label}</span>
        <span className='filter-values'>{valueString}</span>
        <Icon name='close' className='filter-remove-control'
          onClick={this.partial(this.handleResetFilter, index)} />
      </div>
    );
  }

  /**
   * Main render method
   */
  render() {
    const { activeFilters, filterGroup } = this.props;

    if (!activeFilters || !activeFilters.length) {
      return null;
    }

    return (
      <div className="FilterGroupSummary">
        <header className='small-label'>
          {filterGroup.label}
        </header>
        <div className='active-filters'>
          {activeFilters.map((activeFilter, i) => {
            const filter = filterGroup.filters.find(filter => filter.id === activeFilter.id);
            return this.renderFilter(activeFilter, filter, i);
          })}
        </div>
      </div>
    );
  }
}

FilterGroupSummary.propTypes = propTypes;

export default FilterGroupSummary;
