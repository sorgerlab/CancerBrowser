import React from 'react';
import MultiSelectList from '../MultiSelectList';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import boundCallback from '../../utils/boundCallback';
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
  values: React.PropTypes.array
};

class FilterPanel extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.boundCallbacks = {};
  }

  handleFilterChange(filterIndex, groupIndex, newFilterValuesList) {
    console.log('got filter change', filterIndex, groupIndex, newFilterValuesList);
  }

  renderMultiSelectFilter(filter, values, index, groupIndex) {
    return (
      <MultiSelectList items={filter.values}
        values={values && values.values}
        onChange={boundCallback(this, this.boundCallbacks, this.handleFilterChange, index, groupIndex)} />
    );
  }

  renderSelectFilter(filter, values) {
    return <div>Select: {JSON.stringify(values)}</div>;
  }

  renderFilter(filter, values, index, groupIndex) {
    let filterElem;

    switch (filter.type) {
      case 'multi-select':
        filterElem = this.renderMultiSelectFilter(filter, values, index, groupIndex);
        break;
      case 'select':
        filterElem = this.renderSelectFilter(filter, values, index, groupIndex);
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
    const { values } = this.props;

    const filterGroupValues = values.find(groupValues => groupValues.id === group.id);

    return (
      <div key={index} className='filter-panel-group'>
        <header>{group.label}</header>
        <div className='filter-panel-filters'>
          {group.filters.map((filter, i) => {
            let filterValues;
            if (filterGroupValues) {
              filterValues = filterGroupValues.values.find(filterValues => filterValues.id === filter.id);
            }

            return this.renderFilter(filter, filterValues, i, index);
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
