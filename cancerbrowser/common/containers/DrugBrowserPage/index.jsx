import React from 'react';
import { connect } from 'react-redux';
import { ButtonGroup, Button } from 'react-bootstrap';
import { replace } from 'react-router-redux';
import classNames from 'classnames';
import qs from 'qs';

import FilterPanel from '../../components/FilterPanel';
import FilterGroupSummary from '../../components/FilterGroupSummary';
import PageLayout from '../../components/PageLayout';
import DrugCards from '../../components/DrugCards';

import {
  getFilteredDrugs,
  getFilteredDrugCounts,
  getFilterGroups
} from '../../selectors/drug';


import {
  changeDrugView,
  changeActiveFilters,
  resetActiveFilters
} from '../../actions/drug';

const propTypes = {
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object,
  location: React.PropTypes.object,
  filteredDrugs: React.PropTypes.array,
  activeFilters: React.PropTypes.object,
  drugView: React.PropTypes.string,
  drugCounts: React.PropTypes.object,
  filterGroups: React.PropTypes.array
};

const defaultProps = {
  drugView: 'developmentStage'
};

function mapStateToProps(state) {
  return {
    drugView: state.drugs.drugView,
    activeFilters: state.drugs.activeFilters,
    filterGroups: getFilterGroups(state),
    filteredDrugs: getFilteredDrugs(state),
    drugCounts: getFilteredDrugCounts(state)
  };
}


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
    const { dispatch } = this.props;

    // see if filters have changed.
    const filterString = this.props.location.search.replace(/^\?/,'');
    if(filterString.length > 0) {
      const newFilters = qs.parse(filterString);
      this.props.dispatch(changeActiveFilters(newFilters));
    }
  }

  /**
   * Reset the active filters when leaving the page.
   * this prevents drugFilters set here affecting other pages
   */
  componentWillUnmount() {
    this.props.dispatch(resetActiveFilters());
  }

  /**
   * Store filter options in url
   */
  updateFilterUrl(newFilters) {
    const pathname = this.props.location.pathname;
    const search = '?' + qs.stringify(filters, {encode: true});
    this.props.dispatch(replace({pathname: pathname, search: search}));
  }

  /**
   * Callback for filter change
   */
  onFilterChange(newFilters) {
    const { dispatch } = this.props;

    this.updateFilterUrl(newFilters);
    dispatch(changeActiveFilters(newFilters));
  }

  /**
   * Callback for drugFilters section of filters
   * @param {Object} filters for drug parameters
   */
  onDrugFilterChange(newDrugFilters) {
    const { dispatch, activeFilters } = this.props;
    const newActiveFilters = Object.assign({}, activeFilters, { drugFilters: newDrugFilters });

    this.updateFilterUrl(newActiveFilters);
    dispatch(changeActiveFilters(newActiveFilters));
  }

  /**
   * Callback for drug viewby change
   * @param {String} newView New view by state
   */
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
        filterGroups={this.props.filterGroups}
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
              <Button className={classNames({ active: drugView === 'developmentStage' })}
                 onClick={this.onDrugViewChange.bind(this, 'developmentStage')}>
                Development Stage
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button className={classNames({ active: drugView === 'targetGene' })}
                  onClick={this.onDrugViewChange.bind(this, 'targetGene')}>
                Target Gene
              </Button>
              <Button className={classNames({ active: drugView === 'targetRole' })}
                  onClick={this.onDrugViewChange.bind(this, 'targetRole')}>
                Target Gene Class
              </Button>
              <Button className={classNames({ active: drugView === 'targetPathway' })}
                  onClick={this.onDrugViewChange.bind(this, 'targetPathway')}>
                Target Pathway
              </Button>
              <Button className={classNames({ active: drugView === 'targetFunction' })}
                  onClick={this.onDrugViewChange.bind(this, 'targetFunction')}>
                Target Biological Function
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
    const { activeFilters, filterGroups } = this.props;

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
