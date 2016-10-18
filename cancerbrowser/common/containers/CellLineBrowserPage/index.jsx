import React from 'react';
import { connect } from 'react-redux';
import { ButtonGroup, Button } from 'react-bootstrap';
import classNames from 'classnames';
import { replace } from 'react-router-redux';

import FilterPanel from '../../components/FilterPanel';
import FilterGroupSummary from '../../components/FilterGroupSummary';
import PageLayout from '../../components/PageLayout';
import CellLineTable from '../../components/CellLineTable';

import { getFilteredCellLines, getFilteredCellLineCounts, cellLinesFilterGroup } from '../../selectors/cell_line';

import qs from 'qs';

import {
  changeCellLineView,
  changeActiveFilters,
  resetActiveFilters
} from '../../actions/cell_line';

const propTypes = {
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object,
  location: React.PropTypes.object,
  filteredCellLines: React.PropTypes.array,
  activeFilters: React.PropTypes.object,
  cellLineView: React.PropTypes.string,
  cellLineCounts: React.PropTypes.object,
  datasets: React.PropTypes.object
};

const defaultProps = {
  cellLineView: 'summary'
};

function mapStateToProps(state) {
  return {
    datasets: state.datasets.info.primaryDatasets,
    cellLineView: state.cellLines.cellLineView, // TODO: move to .browser.
    activeFilters: state.cellLines.activeFilters,
    filteredCellLines: getFilteredCellLines(state),
    cellLineCounts: getFilteredCellLineCounts(state)
  };
}

const filterGroups = [cellLinesFilterGroup];

/**
 * Container for cell line browser page
 */
class CellLineBrowserPage extends React.Component {
  constructor(props) {
    super(props);

    this.onFilterChange = this.onFilterChange.bind(this);
    this.onCellLineViewChange = this.onCellLineViewChange.bind(this);
    this.onCellLineFilterChange = this.onCellLineFilterChange.bind(this);
  }

  /**
   * Lifecycle method.
   * Acquire data needed to display page
   */
  componentDidMount() {

    // see if filters have changed.
    const filterString = this.props.location.search.replace(/^\?/,'');
    if(filterString.length > 0) {
      const newFilters = qs.parse(filterString);
      this.props.dispatch(changeActiveFilters(newFilters));
    }

  }


  /**
   * Reset the active filters when leaving the page.
   * this prevents cellLineFilters set here affecting other pages
   */
  componentWillUnmount() {
    this.props.dispatch(resetActiveFilters());
  }

  /**
   * Encode filters in URL
   * @param {Object} filters Filters to encode
   */
  updateFilterUrl(filters) {
    const pathname = this.props.location.pathname;
    const search = '?' + qs.stringify(filters, {encode: true});
    this.props.dispatch(replace({pathname: pathname, search: search}));
  }

  /**
   * Call back for filter change
   * @param {Object} newFilters New filtergroups object
   */
  onFilterChange(newFilters) {
    this.updateFilterUrl(newFilters);
    this.props.dispatch(changeActiveFilters(newFilters));
  }

  /**
   * Call back for filter change for specific cell line filters
   * @param {Object} newCellLineFilters New cell line filters object
   */
  onCellLineFilterChange(newCellLineFilters) {
    const { activeFilters } = this.props;
    const newActiveFilters = Object.assign({}, activeFilters, { cellLineFilters: newCellLineFilters });
    this.updateFilterUrl(newActiveFilters);

    this.props.dispatch(changeActiveFilters(newActiveFilters));
  }

  onCellLineViewChange(newView) {
    this.props.dispatch(changeCellLineView(newView));
  }

  /**
   * Renders the cell line filter side bar
   *
   * @return {React.Component}
   */
  renderSidebar() {
    return (
      <FilterPanel
        filterGroups={filterGroups}
        activeFilters={this.props.activeFilters}
        counts={this.props.cellLineCounts}
        onFilterChange={this.onFilterChange} />
    );
  }

  /**
   * Renders the cell line table and view by controls
   *
   * @return {React.Component}
   */
  renderTable() {
    const { filteredCellLines, cellLineView, datasets } = this.props;

    return (
      <div>
        <div className='cell-line-view-controls'>
          <label className='small-label'>View By</label>
          <div>
            <ButtonGroup>
              <Button className={classNames({ active: cellLineView === 'summary' })}
                 onClick={this.onCellLineViewChange.bind(this, 'summary')}>
                Summary
              </Button>
              <Button className={classNames({ active: cellLineView === 'mutations' })}
                  onClick={this.onCellLineViewChange.bind(this, 'mutations')}>
                Mutation Status
              </Button>
              <Button className={classNames({ active: cellLineView === 'datasets' })}
                 onClick={this.onCellLineViewChange.bind(this, 'datasets')}>
                Datasets
              </Button>
            </ButtonGroup>
          </div>
        </div>
        <CellLineTable data={filteredCellLines} view={cellLineView} datasets={datasets} />
      </div>
    );
  }

    /**
   * Renders the filter summary for cell line filters
   *
   * @return {React.Component}
   */
  renderFilterSummary() {
    const { activeFilters } = this.props;

    const cellLineActiveFilters = activeFilters && activeFilters.cellLineFilters;
    const cellLineFilterGroup = filterGroups.find(filterGroup => filterGroup.id === 'cellLineFilters');

    return (
      <div className='cell-line-filters-summary'>
        <FilterGroupSummary
          filterGroup={cellLineFilterGroup}
          activeFilters={cellLineActiveFilters}
          onFilterChange={this.onCellLineFilterChange} />
      </div>
    );
  }

  render() {

    return (
      <PageLayout className="page-with-sidebar page CellLineBrowserPage" sidebar={this.renderSidebar()}>
        <h1>Cell Lines</h1>
        {this.renderFilterSummary()}
        {this.renderTable()}
      </PageLayout>
    );
  }
}

CellLineBrowserPage.defaultProps = defaultProps;
CellLineBrowserPage.propTypes = propTypes;

export default connect(mapStateToProps)(CellLineBrowserPage);
