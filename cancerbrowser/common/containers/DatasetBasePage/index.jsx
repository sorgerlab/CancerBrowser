import React from 'react';
import classNames from 'classnames';
import { replace, push } from 'react-router-redux';
import qs from 'qs';
import _ from 'lodash';

import { getFilteredCellLines, getFilteredCellLineCounts } from '../../selectors/cell_line';

import {
  fetchDatasetIfNeeded
} from '../../actions/dataset';

import { ButtonGroup, Button, Row, Col } from 'react-bootstrap';
import PageLayout from '../../components/PageLayout';
import FilterPanel from '../../components/FilterPanel';
import HelpBox from '../../components/HelpBox';

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

  /**
   * Lifecycle method.
   * Get dataset data if needed.
   */
  componentDidMount() {
    const { datasetId, dispatch } = this.props;
    dispatch(fetchDatasetIfNeeded(datasetId));

    this.initFromUrl();
  }

  /**
   * Lifecycle method.
   * Reset filters
   */
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(this.changeActiveFilters(null));
    // TODO: reset other config values (might need to be done at top level page?)
  }

  /**
   * Parse filters from url if present and
   * set page based on filters and config
   */
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

  /**
   * Provided a {key: value} config object,
   * set page parameters based on this config
   * @param {Object} config Config options with settings.
   */
  initFromConfig(config) {
    const { dispatch } = this.props;

    if(config) {
      if(config.viewBy) {
        dispatch(this.changeViewBy(config.viewBy));
      }
    }

  }

  /**
   * Callback for viewby toggle.
   *
   * @param {String} newView New view to switch to
   */
  handleViewByChange(newView) {
    const { datasetId, dispatch, activeFilters } = this.props;
    dispatch(this.changeViewBy(newView));
    dispatch(fetchDatasetIfNeeded(datasetId, newView));
    this.updateUrlWithConfig(activeFilters, {viewBy: newView});
  }

  /**
   * Set filters and configs in the URL for sharing and persistence.
   *
   * @param {Object} fiters FilterGroups Object
   * @param {Object} config other configs to store using config name as key
   *    and config value as value. Currently only used to store viewBy config.
   * @param {String} mode How to modify the history. Either a push or replace.
   *    defaults to replace
   *
   */
  updateUrlWithConfig(filters, config, mode = 'replace') {
    const { datasetId } = this.props;
    const allConfig = {};
    allConfig.filters = filters;
    allConfig.config = config;

    const query = qs.stringify(allConfig, {encode: true});
    const newPath = {pathname: '/dataset/' + datasetId, search: '?' + query };
    if(mode === 'replace') {
      this.props.dispatch(replace(newPath));
    } else {
      this.props.dispatch(push(newPath));
    }
  }

  /**
   * Callback for filter change
   *
   * @param {Object} newFilters New filterGroups
   */
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

  /**
   * Renders the  top options
   *
   * @return {React.Component}
   */
  renderViewOptions() {
    const { viewBy } = this.props;

    if (!this.viewOptions || !this.viewOptions.length) {
      return null;
    }

    return (
      <div className='cell-line-view-controls'>
        <label className='small-label'>View Across</label>
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

  /**
   * Renders the main content.
   * implemented by sub-classes.
   *
   * @return {React.Component}
   */
  renderMain() { /* template method */ }

  /**
   * Renders any help box content.
   *
   * @return {React.Component}
   */
  renderHelp() {
    const { datasetInfo } = this.props;
    if (datasetInfo && datasetInfo.description) {
      return (
        <p>{ datasetInfo.description }</p>
      );
    }
  }

  /**
   * Renders any extra help box content.
   * implemented by sub-classes.
   *
   * @return {React.Component}
   */
  renderExtraHelp() { /* template method */ }

  /**
   * Renders the help box.
   *
   * @return {React.Component}
   */
  renderHelpBox() {
    const help = this.renderHelp();
    const extraHelp = this.renderExtraHelp();

    if (help || extraHelp) {
      return (
        <HelpBox title="About this dataset">
          { help }
          { extraHelp }
        </HelpBox>
      );
    }
    return null;
  }

  /**
   * Main render method.
   *
   * @return {React.Component}
   */
  render() {
    const { datasetInfo, className } = this.props;

    return (
      <PageLayout className={className} sidebar={this.renderSidebar()}>
        <Row>
          <Col lg={8}>
            <h1>{datasetInfo && datasetInfo.label}</h1>
          </Col>
          <Col lg={4}>
            <div /* vertical padding layout hack */ className="visible-lg-block" style={{height: '28px'}}></div>
            { this.renderHelpBox() }
          </Col>
        </Row>
        {this.renderViewOptions()}
        {this.renderMain()}
      </PageLayout>
    );
  }
}

DatasetBasePage.propTypes = propTypes;
DatasetBasePage.defaultProps = { className: 'DatabaseBasePage' };

export default DatasetBasePage;
