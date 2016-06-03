import React from 'react';
import { connect } from 'react-redux';

import './dataset_receptor_profile_page.scss';

import { getFilteredViewData, getFilterGroups } from '../../selectors/datasetReceptorProfile';
import DatasetBasePage, { baseMapStateToProps } from '../DatasetBasePage';

import {
  fetchReceptorsIfNeeded
} from '../../actions/receptor';


import {
  changeHighlight,
  changeActiveLeft,
  changeActiveRight,
  changeActiveFilters,
  changeViewBy
} from '../../actions/datasetReceptorProfile';

import WaterfallSmallMults from '../../components/WaterfallSmallMults';
import WaterfallPlot from '../../components/WaterfallPlot';

/// Specify the dataset ID here: ////
const datasetId = 'receptor_profile';
const datasetKey = 'datasetReceptorProfile';
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
  const { datasets, receptors } = state;
  const { datasetReceptorProfile } = datasets;

  const baseProps = baseMapStateToProps(state, { datasetId, datasetKey,
    getFilteredViewData, getFilterGroups });

  const props = Object.assign(baseProps, {
    receptors: receptors.items,
    highlightId: datasetReceptorProfile.highlight,
    activeLeft: datasetReceptorProfile.activeLeft,
    activeRight: datasetReceptorProfile.activeRight
  });

  return props;
}

const viewOptions = [
  { label: 'Receptor', value: 'receptor'},
  { label: 'Cell Line', value: 'cellLine' }
];

/**
 * React container for a dataset page page - Receptor Profile
 */
class DatasetReceptorProfilePage extends DatasetBasePage {
  constructor(props) {
    super(props, viewOptions, changeViewBy, changeActiveFilters);

    this.onChangeHighlight = this.onChangeHighlight.bind(this);
    this.onChangeActive = this.onChangeActive.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    const { dispatch } = this.props;
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

  renderSmallMults(datasets) {
    const { highlightId, activeLeft, activeRight, viewBy } = this.props;

    const dataExtent = (viewBy === 'receptor') ? [-6.5, 1] : [-6.5, 1];
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
    const dataExtent = (viewBy === 'receptor') ? [-6.5, 1] : [-6.5, 1];

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

  renderMain() {
    const { filteredData, datasetData, activeLeft, activeRight } = this.props;

    const leftData = this.getData(filteredData, activeLeft);
    const rightData = this.getData(filteredData, activeRight);

    if(!datasetData) {
      return (
        <div></div>
      );
    }

    return (
      <div>
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
      </div>
    );
  }
}

DatasetReceptorProfilePage.propTypes = propTypes;
DatasetReceptorProfilePage.defaultProps = defaultProps;

export default connect(mapStateToProps)(DatasetReceptorProfilePage);
