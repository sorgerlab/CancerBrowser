import React from 'react';
import { connect } from 'react-redux';

import './dataset_receptor_profile_page.scss';

import { getFilteredViewData, getFilterGroups } from '../../selectors/datasetReceptorProfile';
import DatasetBasePage, { baseMapStateToProps } from '../DatasetBasePage';
import { colorScales } from '../../config/colors';

import { getFilterValue } from '../../utils/filter_utils';


import {
  fetchReceptorsIfNeeded
} from '../../actions/receptor';


import {
  changeHighlight,
  changeActiveLeft,
  changeActiveRight,
  changeActiveFilters,
  changeViewBy,
  changeReceptorColorBy
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
  filteredData: React.PropTypes.array,
  receptorColorBy: React.PropTypes.string
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
    receptorColorBy: datasetReceptorProfile.receptorColorBy,
    activeLeft: datasetReceptorProfile.activeLeft,
    activeRight: datasetReceptorProfile.activeRight,
    className: 'DatasetReceptorProfilePage'
  });

  return props;
}

const viewOptions = [
  { label: 'Receptor', value: 'receptor'},
  { label: 'Cell Line', value: 'cellLine' }
];

const mappedColorScales = {
  cellLineReceptorStatus: d => colorScales.cellLineReceptorStatusLighter(d.cell_line.receptorStatus.value),
  cellLineMolecularSubtype: d => colorScales.cellLineMolecularSubtype(d.cell_line.molecularSubtype.value),
  none: undefined
};

/**
 * React container for a dataset page page - Receptor Profile
 */
class DatasetReceptorProfilePage extends DatasetBasePage {
  constructor(props) {
    super(props, viewOptions, changeViewBy, changeActiveFilters);

    this.onChangeHighlight = this.onChangeHighlight.bind(this);
    this.onChangeActive = this.onChangeActive.bind(this);
    this.onReceptorColorChange = this.onReceptorColorChange.bind(this);
    this.getActiveReceptor = this.getActiveReceptor.bind(this);
    this.getCompareReceptor = this.getCompareReceptor.bind(this);
    this.getActiveCellLine = this.getActiveCellLine.bind(this);
    this.getCompareCellLine = this.getCompareCellLine.bind(this);
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

  getActiveReceptor() {
    return getFilterValue(this.props.activeFilters, 'byReceptorConfig', 'receptor');
  }

  getCompareReceptor() {
    return getFilterValue(this.props.activeFilters, 'byReceptorConfig', 'compareTo');
  }

  getActiveCellLine() {
    return getFilterValue(this.props.activeFilters, 'byCellLineConfig', 'cellLine');
  }

  getCompareCellLine() {
    return getFilterValue(this.props.activeFilters, 'byCellLineConfig', 'compareTo');
  }

  onReceptorColorChange(event) {
    const { value } = event.target;
    const { dispatch } = this.props;
    dispatch(changeReceptorColorBy(value));
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

    let colorBy = 'none';
    if (viewBy === 'receptor') {
      colorBy = this.props.receptorColorBy;
    }

    if(dataset) {
      return (
        <WaterfallPlot
          label={dataset.label}
          dataset={dataset.measurements}
          labelLocation={labelLocation}
          onChangeHighlight={this.onChangeHighlight}
          highlightId={highlightId}
          dataExtent={dataExtent}
          colorScale={mappedColorScales[colorBy]} />
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

  renderReceptorChartControls() {
    const { receptorColorBy } = this.props;
    return (
      <div>
        <div className='chart-controls clearfix'>
          <div className='form-group'>
            <label className='small-label'>Color By</label>
            <div>
              <select className='form-control' value={receptorColorBy}
                onChange={this.onReceptorColorChange}>
                <option value='cellLineReceptorStatus'>Cell Line Receptor Status</option>
                <option value='cellLineMolecularSubtype'>Cell Line Molecular Subtype</option>
                <option value='none'>Nothing</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderMain() {
    const { filteredData, datasetData, viewBy } = this.props;

    let leftData = undefined;
    let rightData = undefined;

    if(viewBy === 'receptor') {
      leftData = this.getData(filteredData, this.getActiveReceptor());
      rightData = this.getData(filteredData, this.getCompareReceptor());

    } else {
      leftData = this.getData(filteredData, this.getActiveCellLine());
      rightData = this.getData(filteredData, this.getCompareCellLine());
    }


    if(!datasetData) {
      return (
        <div></div>
      );
    }

    const controls = (viewBy === 'receptor') ? this.renderReceptorChartControls() : '';

    return (
      <div>
        {controls}
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
