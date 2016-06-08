import React from 'react';
import classNames from 'classnames';
import { hashHistory } from 'react-router';
import qs from 'qs';
import _ from 'lodash';

import { getFilteredCellLines, getFilteredCellLineCounts } from '../../selectors/cell_line';

import {
  fetchDatasetIfNeeded,
  fetchDatasetInfo
} from '../../actions/dataset';

import {
  fetchCellLinesIfNeeded
} from '../../actions/cell_line';


import { ButtonGroup, Button } from 'react-bootstrap';
import PageLayout from '../../components/PageLayout';
import FilterPanel from '../../components/FilterPanel';

const propTypes = {
  datasetId: React.PropTypes.string,
  datasetKey: React.PropTypes.string,
  className: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  location: React.PropTypes.object,
  datasetData: React.PropTypes.array,
  datasetInfo: React.PropTypes.object,
  activeFilters: React.PropTypes.object,
  filterGroups: React.PropTypes.array,
  filteredCellLines: React.PropTypes.array,
  cellLineCounts: React.PropTypes.object,
  viewBy: React.PropTypes.string,
  filteredData: React.PropTypes.any
};

export function baseMapStateToProps(state, { datasetId, datasetKey,
    getFilteredViewData, getFilterGroups }) {
  const { datasets } = state;
  const datasetState = datasets[datasetKey];
  const dataset = datasets.datasetsById[datasetId];

  const props = {
    datasetId,
    datasetKey,
    datasetInfo: datasets.info.items[datasetId],
    datasetData: dataset && dataset.items,
    activeFilters: datasetState.activeFilters,
    viewBy: datasetState.viewBy,
    filteredData: getFilteredViewData(state, datasetState),
    filterGroups: getFilterGroups(state, datasetState),
    filteredCellLines: getFilteredCellLines(state, datasetState),
    cellLineCounts: getFilteredCellLineCounts(state, datasetState)
  };

  return props;
}

/**
 * React base container for a dataset page page, should be extended by other
 * pages, not instantiated directly.
 */
class DatasetBasePage extends React.Component {
  constructor(props, viewOptions = [], changeViewBy = () => {},
      changeActiveFilters = () => {}) {
    super(props);

    // provided by subclasses
    this.viewOptions = viewOptions;
    this.changeActiveFilters = changeActiveFilters;
    this.changeViewBy = changeViewBy;

    this.onFilterChange = this.onFilterChange.bind(this);
    this.renderViewOptions = this.renderViewOptions.bind(this);

  }

  componentDidMount() {
    const { datasetId, dispatch } = this.props;
    dispatch(fetchDatasetIfNeeded(datasetId));
    dispatch(fetchDatasetInfo(datasetId));
    dispatch(fetchCellLinesIfNeeded());

    this.initFromUrl();
  }

  initFromUrl() {
    // see if filters have changed.
    const filterString = this.props.location.search.replace(/^\?/,'');
    if(filterString.length > 0) {
      const allConfig = qs.parse(filterString);
      // hack for when filters is not passed in.
      if(_.isString(allConfig.filters)) {
        allConfig.filters = null;
      }
      this.initFromConfig(allConfig.config);
      this.props.dispatch(this.changeActiveFilters(allConfig.filters));
    }
  }

  initFromConfig(config) {
    const { dispatch } = this.props;

    if(config) {
      if(config.viewBy) {
        dispatch(this.changeViewBy(config.viewBy));
      }
    }

  }

  handleViewByChange(newView) {
    const { datasetId, dispatch } = this.props;
    dispatch(this.changeViewBy(newView));
    dispatch(this.changeActiveFilters(null));
    dispatch(fetchDatasetIfNeeded(datasetId, newView));
    this.updateUrlWithConfig(null, {viewBy: newView});
  }

  updateUrlWithConfig(filters, config) {
    const { datasetId } = this.props;
    const allConfig = {};
    allConfig.filters = filters;
    allConfig.config = config;

    const query = qs.stringify(allConfig, {encode: true});
    hashHistory.replace({pathname: '/dataset/' + datasetId, search: '?' + query });
  }

  onFilterChange(newFilters) {
    const { dispatch, viewBy } = this.props;

    this.updateUrlWithConfig(newFilters, {viewBy: viewBy});
    dispatch(this.changeActiveFilters(newFilters));
  }

  /**
   * Renders the side bar
   *
   * @return {React.Component}
   */
  renderSidebar() {
    const { activeFilters, cellLineCounts, filterGroups } = this.props;

    return (
      <FilterPanel
        filterGroups={filterGroups}
        activeFilters={activeFilters}
        counts={cellLineCounts}
        onFilterChange={this.onFilterChange} />
    );
  }

  renderViewOptions() {
    const { viewBy } = this.props;

    if (!this.viewOptions || !this.viewOptions.length) {
      return null;
    }

    return (
      <div className='cell-line-view-controls'>
        <label className='small-label'>View By</label>
        <div>
          <ButtonGroup>
            {this.viewOptions.map((option, i) => {
              return (
                <Button key={i} className={classNames({ active: viewBy === option.value })}
                   onClick={this.handleViewByChange.bind(this, option.value)}>
                  {option.label}
                </Button>
              );
            })}
          </ButtonGroup>
        </div>
      </div>
    );
  }

  renderMain() { /* template method */ }

  render() {
    const { datasetInfo, className } = this.props;

    return (
      <PageLayout className={className} sidebar={this.renderSidebar()}>
        <h1>{datasetInfo && datasetInfo.label}</h1>
        {this.renderViewOptions()}
        {this.renderMain()}
      </PageLayout>
    );
  }
}

DatasetBasePage.propTypes = propTypes;
DatasetBasePage.defaultProps = { className: 'DatabaseBasePage' };

export default DatasetBasePage;
