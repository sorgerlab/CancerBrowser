import React from 'react';
import { connect } from 'react-redux';
import { ButtonGroup, Button } from 'react-bootstrap';
import classNames from 'classnames';

import FilterPanel from '../../components/FilterPanel';
import FilterGroupSummary from '../../components/FilterGroupSummary';
import PageLayout from '../../components/PageLayout';
import DrugCards from '../../components/DrugCards';


import {
  fetchDrugsIfNeeded,
  changeDrugView,
  fetchDrugFilters
} from '../../actions/drug';

import {
  changeActiveFilters,
  resetActiveFilters
} from '../../actions/filter';

const propTypes = {
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object,
  filteredDrugs: React.PropTypes.array,
  activeFilters: React.PropTypes.object,
  drugView: React.PropTypes.string,
  drugCounts: React.PropTypes.object,
  drugFilters: React.PropTypes.array
};

const defaultProps = {
  drugView: 'class'
};

function mapStateToProps(state) {
  return {
    drugView: state.drugs.drugView,
    filteredDrugs: state.drugs.filtered,
    activeFilters: state.filters.active,
    drugCounts: state.drugs.counts,
    drugFilters: state.drugs.drugFilters
  };
}

// create the filter groups using the externally provided drugFilters definition
// since we need to make use of all drug data to generate the proper definition
function createFilterGroups(drugFilters) {
  return [{
    id: 'drugFilters',
    label: 'Drug Filters',
    filters: drugFilters
  }];
}

/**
 * Container component for contents of Drug Browser page content.
 */
class DrugBrowserPage extends React.Component {
  constructor(props) {
    super(props);

    this.filterGroups = createFilterGroups(props.drugFilters);

    this.onFilterChange = this.onFilterChange.bind(this);
    this.onDrugViewChange = this.onDrugViewChange.bind(this);
    this.onDrugFilterChange = this.onDrugFilterChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.drugFilters !== nextProps.drugFilters) {
      this.filterGroups = createFilterGroups(nextProps.drugFilters);
    }
  }

  /**
   * Callback function called after this component has been mounted.
   */
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(fetchDrugsIfNeeded({}, {}));
    dispatch(fetchDrugFilters());
  }

  /*
   * Reset the active filters when leaving the page.
   * this prevents drugFilters set here affecting other pages
   */
  componentWillUnmount() {
    this.props.dispatch(resetActiveFilters());
  }


  onFilterChange(newFilters) {
    const { dispatch } = this.props;

    dispatch(changeActiveFilters(newFilters));
    dispatch(fetchDrugsIfNeeded(newFilters, this.filterGroups));
  }

  onDrugFilterChange(newDrugFilters) {
    const { dispatch, activeFilters } = this.props;
    const newActiveFilters = Object.assign({}, activeFilters, { drugFilters: newDrugFilters });

    dispatch(changeActiveFilters(newActiveFilters));
    dispatch(fetchDrugsIfNeeded(newActiveFilters, this.filterGroups));
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
        filterGroups={this.filterGroups}
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
          <label className='small-label'>Group By</label>
          <div>
            <ButtonGroup className='spaced-right'>
              <Button className={classNames({ active: drugView === 'class' })}
                 onClick={this.onDrugViewChange.bind(this, 'class')}>
                Class
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button className={classNames({ active: drugView === 'targetGene' })}
                  onClick={this.onDrugViewChange.bind(this, 'targetGene')}>
                Gene
              </Button>
              <Button className={classNames({ active: drugView === 'targetRole' })}
                  onClick={this.onDrugViewChange.bind(this, 'targetRole')}>
                Gene Class
              </Button>
              <Button className={classNames({ active: drugView === 'targetPathway' })}
                  onClick={this.onDrugViewChange.bind(this, 'targetPathway')}>
                Pathway
              </Button>
              <Button className={classNames({ active: drugView === 'targetFunction' })}
                  onClick={this.onDrugViewChange.bind(this, 'targetFunction')}>
                Biological Function
              </Button>
            </ButtonGroup>
          </div>
        </div>
        <div className='drug-cards'>
          <DrugCards data={filteredDrugs} groupBy={drugView} />
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
    const drugFilterGroup = this.filterGroups.find(filterGroup => filterGroup.id === 'drugFilters');

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
