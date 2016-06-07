import React from 'react';
import { connect } from 'react-redux';

import './dataset_receptor_profile_page.scss';

import { getFilteredViewData, getFilterGroups } from '../../selectors/datasetReceptorProfile';
import DatasetBasePage, { baseMapStateToProps } from '../DatasetBasePage';
import { colorScales } from '../../config/colors';
import { sortByValueAndId, sortByKey } from '../../utils/sort';

import {
  getFilterValue,
  updateFilterValues } from '../../utils/filter_utils';


import {
  fetchReceptorsIfNeeded
} from '../../actions/receptor';


import {
  changeHighlight,
  changeToggled,
  changeActiveFilters,
  changeViewBy,
  changeSide,
  changeReceptorColorBy,
  changeCellLineSortBy,
  changeReceptorSortBy
} from '../../actions/datasetReceptorProfile';

import WaterfallSmallMults from '../../components/WaterfallSmallMults';
import WaterfallPlot from '../../components/WaterfallPlot';
import AutoWidth from '../../components/AutoWidth';

/// Specify the dataset ID here: ////
const datasetId = 'receptor_profile';
const datasetKey = 'datasetReceptorProfile';
/////////////////////////////////////

const propTypes = {
  dispatch: React.PropTypes.func,
  datasetData: React.PropTypes.array,
  datasetInfo: React.PropTypes.object,
  highlightId: React.PropTypes.string,
  toggledId: React.PropTypes.string,
  activeFilters: React.PropTypes.object,
  filterGroups: React.PropTypes.array,
  filteredCellLines: React.PropTypes.array,
  cellLineCounts: React.PropTypes.object,
  receptors: React.PropTypes.array,
  viewBy: React.PropTypes.string,
  filteredData: React.PropTypes.array,
  receptorColorBy: React.PropTypes.string,
  receptorSortBy: React.PropTypes.string,
  cellLineSortBy: React.PropTypes.string,
  activeSide: React.PropTypes.string
};

const contextTypes = {
  router: React.PropTypes.object
};

const defaultProps = {
};

function mapStateToProps(state) {
  const { datasets, receptors } = state;
  const { datasetReceptorProfile } = datasets;

  const baseProps = baseMapStateToProps(state, { datasetId, datasetKey,
    getFilteredViewData, getFilterGroups });

  const props = Object.assign(baseProps, {
    receptors: receptors.items,
    highlightId: datasetReceptorProfile.highlight,
    toggledId: datasetReceptorProfile.toggled,
    receptorColorBy: datasetReceptorProfile.receptorColorBy,
    activeSide: datasetReceptorProfile.side,
    cellLineSortBy: datasetReceptorProfile.cellLineSortBy,
    receptorSortBy: datasetReceptorProfile.receptorSortBy,
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

const sortsMap = {
  magnitude: sortByValueAndId,
  cellLine: sortByKey('label'),
  receptor: sortByKey('label')
};


/**
 * React container for a dataset page page - Receptor Profile
 */
class DatasetReceptorProfilePage extends DatasetBasePage {
  constructor(props) {
    super(props, viewOptions, changeViewBy, changeActiveFilters);

    this.onChangeHighlight = this.onChangeHighlight.bind(this);
    this.onChangeToggle = this.onChangeToggle.bind(this);
    this.onChangeActive = this.onChangeActive.bind(this);
    this.onReceptorColorChange = this.onReceptorColorChange.bind(this);
    this.onWaterfallLabelClick = this.onWaterfallLabelClick.bind(this);
    this.getActiveReceptor = this.getActiveReceptor.bind(this);
    this.getCompareReceptor = this.getCompareReceptor.bind(this);
    this.getActiveCellLine = this.getActiveCellLine.bind(this);
    this.getCompareCellLine = this.getCompareCellLine.bind(this);
    this.handleReceptorSortByChange = this.handleReceptorSortByChange.bind(this);
    this.handleCellLineSortByChange = this.handleCellLineSortByChange.bind(this);
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

  onChangeToggle(toggledId) {
    const { dispatch } = this.props;
    dispatch(changeToggled(toggledId));
  }

  /**
   * Called when color change control is toggled
   * @param {Object} React event object indicating target
   */
  onChangeActive(activeId) {
    const { dispatch, viewBy, activeFilters } = this.props;

    let { activeSide } = this.props;

    const activeIds = this.getActiveWaterfallPlots(viewBy);
    const subGroup = (viewBy === 'receptor') ? 'byReceptorConfig' : 'byCellLineConfig';
    const newActiveSide = 'right';

    let slideOver = false;

    // if there are now waterfalls shown,
    // display new one on the left.
    if(!activeIds[0] && !activeIds[1]) {
      activeSide = 'left';
    }

    // toggle off right plot
    // if id matches right plot
    if(activeId === activeIds[1]) {
      activeId = undefined;
      activeSide = 'right';
    }

    // toggle off left plot
    // if id matches left plot
    if(activeId === activeIds[0]) {
      activeId = undefined;
      activeSide = 'left';
      if(activeIds[1]) {
        slideOver = true;
      }
    }

    const position = (activeSide === 'left') ? viewBy : 'compareTo';

    let newFilters = updateFilterValues(activeFilters, subGroup, position, [activeId]);

    // if there is a left plot and we are toggling off right plot, then slide over right
    // plot
    if(slideOver) {
      newFilters = updateFilterValues(newFilters, subGroup, viewBy, [activeIds[1]]);
      newFilters = updateFilterValues(newFilters, subGroup, 'compareTo', [undefined]);
    }

    dispatch(changeActiveFilters(newFilters));
    dispatch(changeSide(newActiveSide));
  }

  /**
   * Returns array of two elements
   * with Ids of active and compareby waterfalls
   */
  getActiveWaterfallPlots(viewBy) {
    return (viewBy === 'receptor') ?
      [this.getActiveReceptor(), this.getCompareReceptor()] :
      [this.getActiveCellLine(), this.getCompareCellLine()];
  }

  /**
   * Called when color change control is toggled
   * @param {Object} React event object indicating target
   */
  onReceptorColorChange(event) {
    const { value } = event.target;
    const { dispatch } = this.props;
    dispatch(changeReceptorColorBy(value));
  }


  onWaterfallLabelClick(datum) {
    const path = `/cell_line/${datum.cell_line.id}`;
    this.context.router.push(path);
  }

  handleReceptorSortByChange(evt) {
    const { value } = evt.target;
    const { dispatch } = this.props;
    dispatch(changeReceptorSortBy(value));
  }

  handleCellLineSortByChange(evt) {
    const { value } = evt.target;
    const { dispatch } = this.props;
    dispatch(changeCellLineSortBy(value));
  }


  /**
   * Override parent class method
   * So we can reset the active side toggle.
   */
  handleViewByChange(newView) {
    const { dispatch } = this.props;
    super.handleViewByChange(newView);
    // reset the side we are toggling
    dispatch(changeSide('right'));
  }

  /**
   * Helper function to get Active Receptor from filters
   */
  getActiveReceptor() {
    return getFilterValue(this.props.activeFilters, 'byReceptorConfig', 'receptor');
  }

  /**
   * Helper function to get comapared Receptor from filters
   */
  getCompareReceptor() {
    return getFilterValue(this.props.activeFilters, 'byReceptorConfig', 'compareTo');
  }

  /**
   * Helper function to get Active Cell Line from filters
   */
  getActiveCellLine() {
    return getFilterValue(this.props.activeFilters, 'byCellLineConfig', 'cellLine');
  }

  /**
   * Helper function to get comapared Cell line from filters
   */
  getCompareCellLine() {
    return getFilterValue(this.props.activeFilters, 'byCellLineConfig', 'compareTo');
  }


  /**
   * Render small multiples component passing in a given datasets Array
   * @param {Array} datasets Array of dataset Objects to render.
   */
  renderSmallMults(datasets) {
    const { toggledId, highlightId, viewBy } = this.props;
    const dataExtent = [-6.5, 1];

    const activeIds = this.getActiveWaterfallPlots(viewBy);

    if(datasets) {
      return (
        <WaterfallSmallMults
          datasets={datasets}
          toggledId={toggledId}
          highlightId={highlightId}
          onChangeActive={this.onChangeActive}
          activeIds={activeIds}
          dataExtent={dataExtent} />
      );
    }
  }


  /**
   * Render waterfall for a given dataset
   * @param {Object} dataset Dataset to render.
   */
  renderWaterfall(dataset) {
    const { highlightId, viewBy, toggledId } = this.props;
    const dataExtent = [-6.5, 1];

    let colorBy = 'none';
    let labelClick;
    let sortBy = 'magnitude';
    if (viewBy === 'receptor') {
      colorBy = this.props.receptorColorBy;
      labelClick = this.onWaterfallLabelClick;
      sortBy = sortsMap[this.props.receptorSortBy];
    } else {
      sortBy = sortsMap[this.props.cellLineSortBy];
    }

    if(dataset) {
      return (
        <AutoWidth>
          <WaterfallPlot
            label={dataset.label}
            dataset={dataset.measurements}
            highlightId={highlightId}
            toggledId={toggledId}
            dataExtent={dataExtent}
            colorScale={mappedColorScales[colorBy]}
            dataSort={sortBy}
            onChangeHighlight={this.onChangeHighlight}
            onChangeToggle={this.onChangeToggle}
            onLabelClick={labelClick}
            />
        </AutoWidth>
      );
    } else {
      const entityName = viewBy === 'receptor' ? 'receptor' : 'cell line';
      return (
        <div className="waterfall-help">
          <p>Use the filters on the left or thumbnails on the right to add a {entityName} to compare.</p>
        </div>
      );
    }
  }

  /**
   * Pull out a single object from datasets array based on key string
   * @param {Array} datasets Array of dataset objects.
   * @param {String} activeId Id of dataset to acquire.
   * @return {Object} Individual dataset object with id matching activeId
   */
  getData(datasets, activeId) {

    if(datasets && activeId) {

      const dataset = datasets.filter((d) => d.id === activeId)[0];
      return dataset;

    } else {
      return undefined;
    }
  }

  /**
   * Render JSX for controls on receptor side of visual
   */
  renderReceptorChartControls() {
    const { receptorColorBy, receptorSortBy } = this.props;
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

          <div className='form-group'>
            <label className='small-label'>Sort By</label>
            <div>
              <select className='form-control' value={receptorSortBy}
                  onChange={this.handleReceptorSortByChange}>
                <option value='magnitude'>Magnitude</option>
                <option value='cellLine'>Cell Line</option>
              </select>
            </div>
          </div>

        </div>
      </div>
    );
  }

  renderCellLineChartControls() {
    const { cellLineSortBy } = this.props;
    return (
      <div>
        <div className='chart-controls clearfix'>
          <div className='form-group'>
            <label className='small-label'>Sort By</label>
            <div>
              <select className='form-control' value={cellLineSortBy}
                  onChange={this.handleCellLineSortByChange}>
                <option value='magnitude'>Magnitude</option>
                <option value='receptor'>Receptor</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }


  /**
   * Called by parent class to populatate main body of page.
   */
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

    const controls = (viewBy === 'receptor') ?
      this.renderReceptorChartControls() :  this.renderCellLineChartControls();

    return (
      <div>
        {controls}
        <div className='row'>
          <div className='col-md-4 left-waterfall-container'>
            {this.renderWaterfall(leftData)}
          </div>
          <div className='col-md-4 right-waterfall-container'>
            {this.renderWaterfall(rightData)}
          </div>
          <div className='col-md-4 small-mults-container'>
            {this.renderSmallMults(filteredData)}
          </div>
        </div>
      </div>
    );
  }
}

DatasetReceptorProfilePage.propTypes = propTypes;
DatasetReceptorProfilePage.contextTypes = contextTypes;
DatasetReceptorProfilePage.defaultProps = defaultProps;

export default connect(mapStateToProps)(DatasetReceptorProfilePage);
