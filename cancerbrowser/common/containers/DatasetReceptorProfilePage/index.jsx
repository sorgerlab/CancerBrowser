import React from 'react';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import './dataset_receptor_profile_page.scss';

import { getFilteredViewData, getFilterGroups } from '../../selectors/datasetReceptorProfile';
import DatasetBasePage, { baseMapStateToProps } from '../DatasetBasePage';
import { colorScales } from '../../config/colors';
import { sortByKeysWithDisabled, sortByKey } from '../../utils/sort';

import {
  getFilterValue,
  updateFilterValues } from '../../utils/filter_utils';


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
  params: React.PropTypes.object,
  datasetData: React.PropTypes.array,
  datasetInfo: React.PropTypes.object,
  highlightId: React.PropTypes.string,
  toggledId: React.PropTypes.string,
  activeFilters: React.PropTypes.object,
  filterGroups: React.PropTypes.array,
  filteredCellLines: React.PropTypes.array,
  cellLineCounts: React.PropTypes.object,
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
  const { datasets } = state;
  const { datasetReceptorProfile } = datasets;

  const baseProps = baseMapStateToProps(state, { datasetId, datasetKey,
    getFilteredViewData, getFilterGroups });

  const props = Object.assign(baseProps, {
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
  cellLineMolecularSubtype: d => colorScales.cellLineMolecularSubtypeLighter(d.cell_line.molecularSubtype.value),
  none: undefined
};

const sortsMap = {
  magnitude: sortByKeysWithDisabled(['-value', 'label'], ['label']),
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

  /**
   * Lifecycle method.
   * Fetch data if needed
   */
  componentDidMount() {
    super.componentDidMount();
    const { params, viewBy} = this.props;

    if(params.entityId) {
      const activeIds = this.getActiveWaterfallPlots(viewBy);
      if(params.entityId !== activeIds[0])
      {
        this.initDisplay(params.entityId);
      }
    }
  }

  /**
   * Setup initial display if a active cell line id
   * has been passed in.
   * @param {String} activeId Id of cell line to view
   */
  initDisplay(activeId) {
    const { dispatch, activeFilters } = this.props;
    let newFilters = updateFilterValues(activeFilters, 'byCellLineConfig', 'cellLine', [activeId]);
    newFilters = updateFilterValues(newFilters, 'byCellLineConfig', 'compareTo', [undefined]);

    dispatch(batchActions([changeViewBy('cellLine'), changeActiveFilters(newFilters)]));
  }

  /**
   * Callback for highlight event.
   */
  onChangeHighlight(highlightId) {
    const { dispatch } = this.props;
    dispatch(changeHighlight(highlightId));
  }

  /**
   * Callback for click toggle event.
   */
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

    dispatch(batchActions([changeActiveFilters(newFilters), changeSide(newActiveSide)]));
    super.updateUrlWithConfig(newFilters,  {viewBy: viewBy});
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


  /**
   * Callback for label click.
   */
  onWaterfallLabelClick(datum) {
    const path = `/cell_line/${datum.cell_line.id}`;
    this.context.router.push(path);
  }

  /**
   * Callback for sort by change from receptor viewby
   */
  handleReceptorSortByChange(evt) {
    const { value } = evt.target;
    const { dispatch } = this.props;
    dispatch(changeReceptorSortBy(value));
  }

  /**
   * Callback for sort by change from cell line viewby
   */
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
    let activeId = this.getActiveId(newView);
    const activeSide = activeId ? 'right' : 'left';
    dispatch(changeSide(activeSide));
  }

  /**
   * Helper function to get Active Id of either cell line or receptr
   */
  getActiveId(viewBy) {
    return (viewBy === 'cellLine')  ? this.getActiveCellLine() : this.getActiveReceptor();
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
   * Helper function to get metric value from dataset.
   */
  getMetric(dataset) {
    if (!dataset) {
      return undefined;
    }

    // if it is a top level item, read it there.
    let { metric } = dataset;
    if (metric) {
      return metric;
    }

    // otherwise read it from the first measurement
    metric = dataset.measurements && dataset.measurements[0] && dataset.measurements[0].metric;

    return metric;
  }

  /**
   * Render waterfall for a given dataset
   * @param {Object} dataset Dataset to render.
   * @param {String} position 'left' or 'right'
   */
  renderWaterfall(dataset, position) {
    const { highlightId, viewBy, toggledId } = this.props;
    const dataExtent = [-6.5, 1];

    // read the metric from the first item in the dataset (assumes all use the same unit)
    const metric = this.getMetric(dataset);

    let valueAxisLabel;
    let itemAxisLabel;
    if (metric) {
      valueAxisLabel = `log10(${metric})`;
    }

    let colorBy = 'none';
    let labelClick;
    let sortBy = 'magnitude';
    if (viewBy === 'receptor') {
      colorBy = this.props.receptorColorBy;
      labelClick = this.onWaterfallLabelClick;
      sortBy = sortsMap[this.props.receptorSortBy];
      itemAxisLabel = 'Cell Line';
    } else {
      sortBy = sortsMap[this.props.cellLineSortBy];
      itemAxisLabel = 'Receptor';
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
            itemAxisLabel={itemAxisLabel}
            valueAxisLabel={valueAxisLabel}
            colorScale={mappedColorScales[colorBy]}
            dataSort={sortBy}
            onChangeHighlight={this.onChangeHighlight}
            onChangeToggle={this.onChangeToggle}
            onLabelClick={labelClick}
            />
        </AutoWidth>
      );
    } else {
      const entityName = viewBy === 'receptor' ? 'Receptor' : 'Cell Line';
      let helpText = '';
      if (position === 'left') {
        helpText = <p>Use the <strong>{entityName}</strong> filter on the left or click a <strong>thumbnail</strong> on the right to display receptor data for a particular {entityName.toLowerCase()}.</p>;
      } else {
        helpText = <p>Use the <strong>{entityName}</strong> filter on the left or click a <strong>thumbnail</strong> on the right to add a {entityName.toLowerCase()} to compare.</p>;
      }
      return (
        <div className="waterfall-help">
          {helpText}
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
   * Render controls for receptor viewby
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

  /**
   * Render controls for cell line viewby
   */
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


  renderExtraHelp() {
    return (
      <div>
        <p><a href="http://lincs.hms.harvard.edu/db/datasets/20137">Download source data</a></p>
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
    let smallMultTitle = '';

    if(viewBy === 'receptor') {
      leftData = this.getData(filteredData, this.getActiveReceptor());
      rightData = this.getData(filteredData, this.getCompareReceptor());
      smallMultTitle = 'All Receptors';

    } else {
      leftData = this.getData(filteredData, this.getActiveCellLine());
      rightData = this.getData(filteredData, this.getCompareCellLine());
      smallMultTitle = 'All Cell Lines';
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
        <div className='row'>
          <div className='col-md-8'>
            {controls}
          </div>
          <div className='col-md-4'>
            <h3>{smallMultTitle}</h3>
          </div>

        </div>
        <div className='row'>
          <div className='col-md-4 left-waterfall-container'>
            {this.renderWaterfall(leftData, 'left')}
          </div>
          <div className='col-md-4 right-waterfall-container'>
            {this.renderWaterfall(rightData, 'right')}
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
