import React from 'react';
import _ from 'lodash';
import { Icon } from 'react-fa';
import MultiSelectFilter from '../MultiSelectFilter';
import SelectFilter from '../SelectFilter';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import boundCallback from '../../utils/boundCallback';
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

class FilterGroupSummary extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.boundCallbacks = {};
  }

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
        <Icon name='close' className='filter-remove-control' />
      </div>
    );
  }

  render() {
    const { activeFilters, filterGroup } = this.props;

    if (!activeFilters || !activeFilters.length) {
      return null;
    }

    return (
      <div className="FilterGroupSummary">
        <header>
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
