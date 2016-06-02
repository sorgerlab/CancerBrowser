import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { connect } from 'react-redux';

import {
  fetchDatasetIfNeeded,
  fetchDatasetInfo
} from '../../actions/dataset';

import {
  fetchCellLinesIfNeeded
} from '../../actions/cell_line';

import {
  changeActiveFilters
} from '../../actions/datasetReceptorProfile';

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
  filteredCellLines: React.PropTypes.array,
  activeFilters: React.PropTypes.object,
  cellLineCounts: React.PropTypes.object
};

function mapStateToProps(state) {
  const dataset = state.datasets.datasetsById[datasetId];

  return {
    datasetInfo: state.datasets.info.items[datasetId],
    datasetData: dataset && dataset.items,
    activeFilters: state.datasets.datasetReceptorProfile.activeFilters,
    filteredCellLines: state.cellLines.filtered,
    cellLineCounts: state.cellLines.counts
  };
}

const datasetConfiguration = [
  {
    id: 'receptor',
    label: 'Receptor',
    type: 'select',
    values: [
      { value: 'erbb1', label: 'ErbB1' }
    ]
  },
  {
    id: 'compareTo',
    label: 'Compare to',
    type: 'select',
    values: [
      { value: 'perbb1', label: 'pErbB1' }
    ]
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

function filterDataByCellLines(data, cellLines) {
  if (!data) {
    return data;
  }

  return data.filter(d => cellLines.find(cellLine => cellLine.id === d.cell_line.id));
}

/**
 * React container for a dataset page page - Receptor Profile
 */
class DatasetReceptorProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.onFilterChange = this.onFilterChange.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidMount() {
    const { dispatch, activeFilters } = this.props;
    dispatch(fetchDatasetIfNeeded(datasetId));
    dispatch(fetchDatasetInfo(datasetId));
    dispatch(fetchCellLinesIfNeeded(activeFilters, filterGroups));
  }

  onFilterChange(newFilters) {
    const { dispatch } = this.props;

    dispatch(changeActiveFilters(newFilters));
    dispatch(fetchCellLinesIfNeeded(newFilters, filterGroups));
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
    const { activeFilters, cellLineCounts } = this.props;

    return (
      <FilterPanel
        filterGroups={filterGroups}
        activeFilters={activeFilters}
        counts={cellLineCounts}
        onFilterChange={this.onFilterChange} />
    );
  }

  render() {
    const { datasetInfo, filteredCellLines, datasetData } = this.props;

    const filteredData = filterDataByCellLines(datasetData, filteredCellLines);

    return (
      <PageLayout className='DatasetReceptorProfilePage' sidebar={this.renderSidebar()}>
        <h1>{datasetInfo && datasetInfo.label}</h1>
        {this.renderSmallMults(filteredData)}
      </PageLayout>
    );
  }
}

DatasetReceptorProfilePage.propTypes = propTypes;

export default connect(mapStateToProps)(DatasetReceptorProfilePage);
