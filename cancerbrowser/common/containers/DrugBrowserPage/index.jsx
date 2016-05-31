import React from 'react';
import { connect } from 'react-redux';
import { ButtonGroup, Button } from 'react-bootstrap';
import classNames from 'classnames';

import FilterPanel from '../../components/FilterPanel';
import FilterGroupSummary from '../../components/FilterGroupSummary';
import PageLayout from '../../components/PageLayout';


import {
  fetchDrugsIfNeeded,
  changeDrugView
} from '../../actions/drug';

import {
  changeActiveFilters
} from '../../actions/filter';

const propTypes = {
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object,
  filteredDrugs: React.PropTypes.array,
  activeFilters: React.PropTypes.object,
  drugView: React.PropTypes.string,
  drugCounts: React.PropTypes.object
};

const defaultProps = {
  drugView: 'class'
};

function mapStateToProps(state) {
  return {
    drugView: state.drugs.drugView,
    filteredDrugs: state.drugs.filtered,
    activeFilters: state.filters.active,
    drugCounts: state.drugs.counts
  };
}


// The definition of the filter group used for the Drug ilters
export const drugFilters = [
  {
    id: 'class',
    label: 'Class',
    type: 'multi-select',
    values: [
      { value: 'preclinical', label: 'Preclinical' },
      { value: 'phase1', label: 'Phase 1' },
      { value: 'phase2', label: 'Phase 2' },
      { value: 'phase3', label: 'Phase 3' },
      { value: 'approved', label: 'Approved' }
    ]
  }, {
    id: 'target',
    label: 'Target / Pathway',
    type: 'multi-select',
    values: [
      { value: 'nm', label: 'NM' },
      { value: 'her2amp', label: 'HER2amp' },
      { value: 'tnbc', label: 'TNBC' },
      { value: 'hrplus', label: 'HR+' }
    ]
  }
];

const filterGroups = [{
  id: 'drugFilters',
  label: 'Drug Filters',
  filters: drugFilters
}];

/**
 * Container component for contents of Drug Browser page content.
 */
class DrugBrowserPage extends React.Component {
  constructor(props) {
    super(props);

    this.onFilterChange = this.onFilterChange.bind(this);
    this.onDrugViewChange = this.onDrugViewChange.bind(this);
    this.onDrugFilterChange = this.onDrugFilterChange.bind(this);
  }

  /**
   * Callback function called after this component has been mounted.
   */
  componentDidMount() {
    this.props.dispatch(fetchDrugsIfNeeded({}, {}));
  }

  onFilterChange(newFilters) {
    this.props.dispatch(changeActiveFilters(newFilters));
    this.props.dispatch(fetchDrugsIfNeeded(newFilters, filterGroups));
  }

  onDrugFilterChange(newDrugFilters) {
    const { activeFilters } = this.props;
    const newActiveFilters = Object.assign({}, activeFilters, { drugFilters: newDrugFilters });

    this.props.dispatch(changeActiveFilters(newActiveFilters));
    this.props.dispatch(fetchDrugsIfNeeded(newActiveFilters, filterGroups));
  }

  onDrugViewChange(newView) {
    this.props.dispatch(changeDrugView(newView));
  }

  /**
   * Renders the drug filter side bar
   *
   * @return {React.Component}
   */
  renderSidebar() {
    return (
      <FilterPanel
        filterGroups={filterGroups}
        activeFilters={this.props.activeFilters}
        counts={this.props.drugCounts}
        onFilterChange={this.onFilterChange} />
    );
  }

  /**
   * Renders the drug cards and view by controls
   *
   * @return {React.Component}
   */
  renderCards() {
    const { filteredDrugs, drugView } = this.props;

    return (
      <div>
        <div className='drug-view-controls'>
          <label className='small-label'>View By</label>
          <div>
            <ButtonGroup>
              <Button className={classNames({ active: drugView === 'class' })}
                 onClick={this.onDrugViewChange.bind(this, 'class')}>
                Class
              </Button>
              <Button className={classNames({ active: drugView === 'target' })}
                  onClick={this.onDrugViewChange.bind(this, 'target')}>
                Target / Pathway
              </Button>
            </ButtonGroup>
          </div>
        </div>
        <div className='drug-cards'>
          Cards here. {drugView}
        </div>
      </div>
    );
  }

  /**
   * Renders the filter summary for drug filters
   *
   * @return {React.Component}
   */
  renderFilterSummary() {
    const { activeFilters } = this.props;

    const drugActiveFilters = activeFilters && activeFilters.drugFilters;
    const drugFilterGroup = filterGroups.find(filterGroup => filterGroup.id === 'drugFilters');

    return (
      <div className='drug-filters-summary'>
        <FilterGroupSummary
          filterGroup={drugFilterGroup}
          activeFilters={drugActiveFilters}
          onFilterChange={this.onDrugFilterChange} />
      </div>
    );
  }


  /**
   * Render out JSX for DrugBrowserPage.
   * @return {ReactElement} JSX markup.
   */
  render() {
    console.log(this.props.filteredDrugs);

    return (
      <PageLayout className="DrugBrowserPage" sidebar={this.renderSidebar()}>
        <h1>Drugs</h1>
        {this.renderFilterSummary()}
        {this.renderCards()}
      </PageLayout>
    );
  }
}

DrugBrowserPage.defaultProps = defaultProps;
DrugBrowserPage.propTypes = propTypes;

export default connect(mapStateToProps)(DrugBrowserPage);
