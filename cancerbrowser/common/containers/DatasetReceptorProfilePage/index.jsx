import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import _ from 'lodash';

import './dataset_receptor_profile_page.scss';

import { getFilteredViewData } from '../../selectors/datasetReceptorProfile';

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
  changeViewBy,
  changeHighlight,
  changeActiveLeft,
  changeActiveRight
} from '../../actions/datasetReceptorProfile';

import { ButtonGroup, Button } from 'react-bootstrap';
import PageLayout from '../../components/PageLayout';
import WaterfallSmallMults from '../../components/WaterfallSmallMults';
import WaterfallPlot from '../../components/WaterfallPlot';
import { cellLineFilters } from '../../containers/CellLineBrowserPage';
import FilterPanel from '../../components/FilterPanel';

/// Specify the dataset ID here: ////
const datasetId = 'receptor_profile';
/////////////////////////////////////

const propTypes = {
  dispatch: React.PropTypes.func,
  datasetData: React.PropTypes.array,
  datasetInfo: React.PropTypes.object,
  highlightId: React.PropTypes.string,
  activeLeft: React.PropTypes.string,
  activeRight: React.PropTypes.string,
  activeFilters: React.PropTypes.object,
  filterGroups: React.PropTypes.array,
  filteredCellLines: React.PropTypes.array,
  cellLineCounts: React.PropTypes.object,
  receptors: React.PropTypes.array,
  viewBy: React.PropTypes.string,
  filteredData: React.PropTypes.array
};

const defaultProps = {
  activeLeft: 'bt-20',
  activeRight: 'bt-483'
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
    filteredData: getFilteredViewData(state),
    highlightId: datasetReceptorProfile.highlight,
    activeLeft: datasetReceptorProfile.activeLeft,
    activeRight: datasetReceptorProfile.activeRight
  };

  // TODO - reselect this?
  Object.assign(props, {
    filterGroups: makeFilterGroups(props.filteredCellLines, props.receptors, props.viewBy)
  });

  return props;
}

/**
 * Takes the dataset data and generates the filter definition.
 * We need the data to populate the values in the dataset config
 */
function makeFilterGroups(cellLines, receptors, viewBy) {
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
    }
  ];

  if(viewBy === 'receptor') {
    filterGroups.push({
      id: 'cellLineFilters',
      label: 'Cell Line Filters',
      filters: cellLineFilters.filter(filter => filter.id !== 'dataset')
    });
  }

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
    this.onChangeHighlight = this.onChangeHighlight.bind(this);
    this.onChangeActive = this.onChangeActive.bind(this);
  }

  componentDidMount() {
    const { dispatch, activeFilters, filterGroups } = this.props;
    dispatch(fetchDatasetIfNeeded(datasetId));
    dispatch(fetchDatasetInfo(datasetId));
    dispatch(fetchCellLinesIfNeeded(activeFilters, filterGroups));
    dispatch(fetchReceptorsIfNeeded());
  }

  onChangeHighlight(highlightId) {
    const { dispatch } = this.props;
    dispatch(changeHighlight(highlightId));
  }

  onChangeActive(activeId) {
    this.toggleActive = this.toggleActive || 'left';
    const { dispatch } = this.props;
    if(this.toggleActive === 'left') {
      dispatch(changeActiveLeft(activeId));
    } else {
      dispatch(changeActiveRight(activeId));
    }
    this.toggleActive = this.toggleActive === 'left' ? 'right' : 'left';
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

  renderSmallMults(datasets) {
    const { highlightId, activeLeft, activeRight, viewBy } = this.props;

    const dataExtent = (viewBy === 'receptor') ? undefined : [-7, 1];
    if(datasets) {
      return (
        <WaterfallSmallMults
          datasets={datasets}
          highlightId={highlightId}
          onChangeActive={this.onChangeActive}
          activeLeft={activeLeft}
          activeRight={activeRight}
          dataExtent={dataExtent} />
      );
    }
  }


  renderWaterfall(dataset, labelLocation) {
    const { highlightId, viewBy } = this.props;
    const dataExtent = (viewBy === 'receptor') ? undefined : [-7, 1];

    if(dataset) {
      return (
        <WaterfallPlot
          dataset={dataset}
          labelLocation={labelLocation}
          onChangeHighlight={this.onChangeHighlight}
          highlightId={highlightId}
          dataExtent={dataExtent} />
      );
    }
  }

  getData(datasets, activeId) {
    if(datasets && activeId) {

      const dataset = datasets.filter((d) => d.id === activeId)[0];
      return dataset;

    } else {
      return undefined;
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
    const { datasetInfo, filteredData, datasetData, activeLeft, activeRight } = this.props;

    const leftData = this.getData(filteredData, activeLeft);
    const rightData = this.getData(filteredData, activeRight);

    if(!datasetData) {
      return (
        <div></div>
      );
    }

    return (
      <PageLayout className='DatasetReceptorProfilePage' sidebar={this.renderSidebar()}>
        <h1>{datasetInfo && datasetInfo.label}</h1>
        <div className='row'>
          {this.renderViewOptions()}
        </div>
        <div className='row'>
          <div className='col-md-4'>
            {this.renderWaterfall(leftData, 'left')}
          </div>
          <div className='col-md-4'>
            {this.renderWaterfall(rightData, 'left')}
          </div>
          <div className='col-md-4'>
            {this.renderSmallMults(filteredData)}
          </div>
        </div>
      </PageLayout>
    );
  }
}

DatasetReceptorProfilePage.propTypes = propTypes;
DatasetReceptorProfilePage.defaultProps = defaultProps;

export default connect(mapStateToProps)(DatasetReceptorProfilePage);
