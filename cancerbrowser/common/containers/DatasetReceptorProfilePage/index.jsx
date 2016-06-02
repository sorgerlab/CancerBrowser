import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import _ from 'lodash';

import { getViewData } from '../../selectors/datasetReceptorProfile';

import {
  fetchDatasetIfNeeded,
  fetchDatasetInfo
} from '../../actions/dataset';

import {
  fetchCellLinesIfNeeded
} from '../../actions/cell_line';

import {
  fetchReceptorsIfNeeded
} from '../../actions/receptor';


import {
  changeActiveFilters,
  changeViewBy
} from '../../actions/datasetReceptorProfile';

import { ButtonGroup, Button } from 'react-bootstrap';
import PageLayout from '../../components/PageLayout';
import WaterfallSmallMults from '../../components/WaterfallSmallMults';
import { cellLineFilters } from '../../containers/CellLineBrowserPage';
import FilterPanel from '../../components/FilterPanel';

/// Specify the dataset ID here: ////
const datasetId = 'receptor_profile';
/////////////////////////////////////

const propTypes = {
  dispatch: React.PropTypes.func,
  datasetData: React.PropTypes.array,
  datasetInfo: React.PropTypes.object,
  activeFilters: React.PropTypes.object,
  filterGroups: React.PropTypes.array,
  filteredCellLines: React.PropTypes.array,
  cellLineCounts: React.PropTypes.object,
  receptors: React.PropTypes.array,
  viewBy: React.PropTypes.string,
  viewData: React.PropTypes.array
};

function mapStateToProps(state) {
  const { datasets, cellLines, receptors } = state;
  const { datasetReceptorProfile } = datasets;
  const dataset = datasets.datasetsById[datasetId];

  const props = {
    datasetInfo: datasets.info.items[datasetId],
    datasetData: dataset && dataset.items,
    filteredCellLines: cellLines.filtered,
    cellLineCounts: cellLines.counts,
    receptors: receptors.items,
    activeFilters: datasetReceptorProfile.activeFilters,
    viewBy: datasetReceptorProfile.viewBy,
    viewData: getViewData(state)
  };

  // TODO - reselect this?
  Object.assign(props, {
    filterGroups: makeFilterGroups(props.filteredCellLines, props.receptors)
  });

  return props;
}

/**
 * Takes the dataset data and generates the filter definition.
 * We need the data to populate the values in the dataset config
 */
function makeFilterGroups(cellLines, receptors) {
  const datasetConfiguration = [
    {
      id: 'receptor',
      label: 'Receptor',
      type: 'select',
      values: receptors,
      options: {
        props: { counts: null }
      }
    },
    {
      id: 'compareTo',
      label: 'Compare to',
      type: 'select',
      values: receptors,
      options: {
        props: { counts: null }
      }
    }
  ];

  const filterGroups = [
    {
      id: 'receptorProfileConfig',
      label: 'Configure',
      filters: datasetConfiguration
    },
    {
      id: 'cellLineFilters',
      label: 'Cell Line Filters',
      filters: cellLineFilters.filter(filter => filter.id !== 'dataset')
    }
  ];

  return filterGroups;
}

/**
 * React container for a dataset page page - Receptor Profile
 */
class DatasetReceptorProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.renderViewOptions = this.renderViewOptions.bind(this);
  }

  componentDidMount() {
    const { dispatch, activeFilters, filterGroups } = this.props;
    dispatch(fetchDatasetIfNeeded(datasetId));
    dispatch(fetchDatasetInfo(datasetId));
    dispatch(fetchCellLinesIfNeeded(activeFilters, filterGroups));
    dispatch(fetchReceptorsIfNeeded());
  }

  handleViewByChange(newView) {
    const { dispatch } = this.props;
    dispatch(changeViewBy(newView));
    dispatch(fetchDatasetIfNeeded(datasetId, newView));
  }

  onFilterChange(newFilters) {
    const { dispatch, filterGroups } = this.props;
    dispatch(changeActiveFilters(newFilters));

    // TODO these should just be affected by cellLineFilters not all the filter groups...
    dispatch(fetchCellLinesIfNeeded(_.pick(newFilters, 'cellLineFilters'),
      filterGroups.filter(filterGroup => filterGroup.id === 'cellLineFilters')));
  }

  renderSmallMults(data) {
    if (data) {
      return (
        <WaterfallSmallMults
          datasets={data} />
      );
    }
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

    return (
      <div className='cell-line-view-controls'>
        <label className='small-label'>View By</label>
        <div>
          <ButtonGroup>
            <Button className={classNames({ active: viewBy === 'receptor' })}
               onClick={this.handleViewByChange.bind(this, 'receptor')}>
              Receptor
            </Button>
            <Button className={classNames({ active: viewBy === 'cellLine' })}
                onClick={this.handleViewByChange.bind(this, 'cellLine')}>
              Cell Line
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }

  render() {
    const { datasetInfo, viewData } = this.props;


    return (
      <PageLayout className='DatasetReceptorProfilePage' sidebar={this.renderSidebar()}>
        <h1>{datasetInfo && datasetInfo.label}</h1>
        {this.renderViewOptions()}
        {this.renderSmallMults(viewData)}
      </PageLayout>
    );
  }
}

DatasetReceptorProfilePage.propTypes = propTypes;

export default connect(mapStateToProps)(DatasetReceptorProfilePage);
