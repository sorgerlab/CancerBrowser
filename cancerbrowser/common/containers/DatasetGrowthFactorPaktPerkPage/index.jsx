import React from 'react';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import _ from 'lodash';
import d3 from 'd3';
import { Row, Col } from 'react-bootstrap';

import { getFilteredViewData, getFilterGroups, getParallelCoordinatesPlotData } from '../../selectors/datasetGrowthFactorPaktPerk';
import {
  getFilterValue,
  getFilterValueItem,
  updateFilterValues } from '../../utils/filter_utils';
import DatasetBasePage, { baseMapStateToProps } from '../DatasetBasePage';
import { colorScales } from '../../config/colors';
import { sortByKeys, sortByKey } from '../../utils/sort';

import {
  changeActiveFilters,
  changeViewBy,
  changeHighlightedCellLine,
  changeHighlightedGrowthFactor,
  changeToggledCellLine,
  changeToggledGrowthFactor,
  changeGrowthFactorColorBy,
  changeGrowthFactorSortBy,
  changeCellLineSortBy
} from '../../actions/datasetGrowthFactorPaktPerk';

import {
  fetchDatasetIfNeeded
} from '../../actions/dataset';

import AutoWidth from '../../components/AutoWidth';
import WaterfallPlot from '../../components/WaterfallPlot';
import ParallelCoordinatesPlot from '../../components/ParallelCoordinatesPlot';

import './dataset_growth_factor_pakt_perk_page.scss';

/// Specify the dataset ID here: ////
const datasetId = 'growth_factor_pakt_perk';
const datasetRawId = 'growth_factor_pakt_perk_raw';
const datasetKey = 'datasetGrowthFactorPaktPerk';
/////////////////////////////////////


const propTypes = {
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object,
  datasetData: React.PropTypes.array,
  datasetInfo: React.PropTypes.object,
  highlightedCellLine: React.PropTypes.string,
  highlightedGrowthFactor: React.PropTypes.string,
  toggledCellLine: React.PropTypes.string,
  toggledGrowthFactor: React.PropTypes.string,
  activeFilters: React.PropTypes.object,
  filterGroups: React.PropTypes.array,
  filteredCellLines: React.PropTypes.array,
  cellLineCounts: React.PropTypes.object,
  viewBy: React.PropTypes.string,
  filteredData: React.PropTypes.object,
  className: React.PropTypes.string,
  growthFactorColorBy: React.PropTypes.string,
  growthFactorSortBy: React.PropTypes.string,
  parallelCoordinatesPlotData: React.PropTypes.array,
  cellLineColorBy: React.PropTypes.string,
  cellLineSortBy: React.PropTypes.string
};

const contextTypes = {
  router: React.PropTypes.object
};


const defaultProps = {
  className: 'DatasetGrowthFactorPaktPerkPage'
};

function mapStateToProps(state) {
  const { datasets } = state;
  const { datasetGrowthFactorPaktPerk } = datasets;

  const baseProps = baseMapStateToProps(state, { datasetId, datasetKey,
    getFilteredViewData, getFilterGroups });

  const props = Object.assign(baseProps, {
    /* Add custom props here */
    highlightedCellLine: datasetGrowthFactorPaktPerk.highlightedCellLine,
    toggledCellLine: datasetGrowthFactorPaktPerk.toggledCellLine,
    growthFactorColorBy: datasetGrowthFactorPaktPerk.growthFactorColorBy,
    growthFactorSortBy: datasetGrowthFactorPaktPerk.growthFactorSortBy,
    parallelCoordinatesPlotData: getParallelCoordinatesPlotData(state, datasetGrowthFactorPaktPerk),
    highlightedGrowthFactor: datasetGrowthFactorPaktPerk.highlightedGrowthFactor,
    toggledGrowthFactor: datasetGrowthFactorPaktPerk.toggledGrowthFactor,
    cellLineSortBy: datasetGrowthFactorPaktPerk.cellLineSortBy,
    cellLineColorBy: datasetGrowthFactorPaktPerk.cellLineColorBy
  });

  return props;
}

const viewOptions = [
  { label: 'Growth Factor', value: 'growthFactor'},
  { label: 'Cell Line', value: 'cellLine' }
];


const mappedColorScales = {
  cellLineReceptorStatus: d => colorScales.cellLineReceptorStatusLighter(d.cell_line.receptorStatus.value),
  cellLineMolecularSubtype: d => colorScales.cellLineMolecularSubtypeLighter(d.cell_line.molecularSubtype.value),
  none: undefined
};

const sortsMap = {
  magnitude: sortByKeys(['-value', 'label']),
  cellLine: sortByKey('label'),
  growthFactor: sortByKey('label')
};

/**
 * React container for a dataset page page - Growth Factor pAKT/pERK page
 */
class DatasetGrowthFactorPaktPerkPage extends DatasetBasePage {
  constructor(props) {
    super(props, viewOptions, changeViewBy, changeActiveFilters);
    this.renderWaterfall = this.renderWaterfall.bind(this);
    this.renderWaterfalls = this.renderWaterfalls.bind(this);
    this.renderHelpMessage = this.renderHelpMessage.bind(this);
    this.renderGrowthFactorChartControls = this.renderGrowthFactorChartControls.bind(this);
    this.onChangeHighlight = this.onChangeHighlight.bind(this);
    this.onChangeToggle = this.onChangeToggle.bind(this);
    this.onWaterfallLabelClick = this.onWaterfallLabelClick.bind(this);
    this.handleGrowthFactorColorByChange = this.handleGrowthFactorColorByChange.bind(this);
    this.handleGrowthFactorSortByChange = this.handleGrowthFactorSortByChange.bind(this);
    this.handleCellLineSortByChange = this.handleCellLineSortByChange.bind(this);
    this.getActiveGrowthFactor = this.getActiveGrowthFactor.bind(this);
    this.getActiveCellLine = this.getActiveCellLine.bind(this);
    this.getActiveParameter = this.getActiveParameter.bind(this);
    this.getActiveMetricAndType = this.getActiveMetricAndType.bind(this);
    this.getActiveConcentration = this.getActiveConcentration.bind(this);
  }

  /**
   * Lifecycle method.
   * Fetch data if needed
   */
  componentDidMount() {
    const { dispatch, params } = this.props;
    super.componentDidMount();

    // get the extra dataset file
    dispatch(fetchDatasetIfNeeded(datasetRawId));

    if(params.entityId) {
      this.initView(params.entityId);
    }
  }

  /**
   * Set initial display to focus on the activeId
   * @param {String} activeId id of the cell line to display
   */
  initView(activeId) {
    const { dispatch, activeFilters } = this.props;
    let newFilters = updateFilterValues(activeFilters, 'datasetConfig', 'cellLine', [activeId]);
    dispatch(batchActions([changeViewBy('cellLine'), changeActiveFilters(newFilters)]));
  }

  /**
   * Get active growth factor from filters prop
   */
  getActiveGrowthFactor() {
    const { filterGroups, activeFilters } = this.props;
    return getFilterValueItem(filterGroups, activeFilters, 'datasetConfig', 'growthFactor');
  }

  /**
   * Get active cell line from filters prop
   */
  getActiveCellLine() {
    const { filterGroups, activeFilters } = this.props;
    return getFilterValueItem(filterGroups, activeFilters, 'datasetConfig', 'cellLine');
  }

  /**
   * Get active parameter from filters prop
   */
  getActiveParameter() {
    const { filterGroups, activeFilters } = this.props;

    const filterGroupId = 'datasetConfig';
    return getFilterValueItem(filterGroups, activeFilters, filterGroupId, 'parameter');
  }

  /**
   * Get active metric from filters prop
   */
  getActiveMetricAndType() {
    const parameter = this.getActiveParameter();

    if (!parameter) {
      return {};
    }

    let result = {};

    switch(parameter.value) {
      case 'paktFoldChange':
        result.metric = 'fold change';
        result.unit = 'log10(Fold Change)';
        result.type = 'pAkt';
        break;
      case 'paktRawValues':
        result.metric = 'raw values';
        result.unit = 'log10(A.U.)';
        result.type = 'pAkt';
        break;
      case 'perkFoldChange':
        result.metric = 'fold change';
        result.unit = 'log10(Fold Change)';
        result.type = 'pErk';
        break;
      case 'perkRawValues':
        result.metric = 'raw values';
        result.unit = 'log10(A.U.)';
        result.type = 'pErk';
        break;
    }

    return result;
  }

  /**
   * Get active concentration from filters prop
   */
  getActiveConcentration() {
    const { activeFilters } = this.props;
    const filterGroupId = 'datasetConfig';

    return getFilterValue(activeFilters, filterGroupId, 'concentration');
  }

  /**
   * Callback for highlight change
   */
  onChangeHighlight(highlightId) {
    const { dispatch, viewBy } = this.props;
    if (viewBy === 'growthFactor') {
      dispatch(changeHighlightedCellLine(highlightId));
    } else {
      dispatch(changeHighlightedGrowthFactor(highlightId));
    }
  }

  /**
   * Callback for click toggle change
   */
  onChangeToggle(toggleId) {
    const { dispatch, viewBy } = this.props;
    if (viewBy === 'growthFactor') {
      dispatch(changeToggledCellLine(toggleId));
    } else {
      dispatch(changeToggledGrowthFactor(toggleId));
    }
  }

  /**
   * Callback for waterfall label click
   */
  onWaterfallLabelClick(datum) {
    const path = `/cell_line/${datum.cell_line.id}`;
    this.context.router.push(path);
  }

  /**
   * Callback for color by change from growth factor viewby
   */
  handleGrowthFactorColorByChange(evt) {
    const { value } = evt.target;
    const { dispatch } = this.props;
    dispatch(changeGrowthFactorColorBy(value));
  }

  /**
   * Callback for sort by change from growth factor viewby
   */
  handleGrowthFactorSortByChange(evt) {
    const { value } = evt.target;
    const { dispatch } = this.props;
    dispatch(changeGrowthFactorSortBy(value));
  }

  /**
   * Callback for sort by change from cell lines viewby
   */
  handleCellLineSortByChange(evt) {
    const { value } = evt.target;
    const { dispatch } = this.props;
    dispatch(changeCellLineSortBy(value));
  }

  /**
   * Render parallel coordinates component
   */
  renderParallelCoordinatesPlot() {
    const { filteredData, parallelCoordinatesPlotData, viewBy } = this.props;
    if (!parallelCoordinatesPlotData || _.isEmpty(parallelCoordinatesPlotData) ||
         !filteredData || _.isEmpty(filteredData)) {
      return null;
    }

    const { unit } = this.getActiveMetricAndType();

    let colorBy, highlightId, toggledId;
    if (viewBy === 'growthFactor') {
      colorBy = this.props.growthFactorColorBy;
      highlightId = this.props.highlightedCellLine;
      toggledId = this.props.toggledCellLine;
    } else {
      colorBy = this.props.cellLineColorBy;
      highlightId = this.props.highlightedGrowthFactor;
      toggledId = this.props.toggledGrowthFactor;
    }

    const pointLabels = Object.keys(filteredData);

    return (
      <div className='parallel-coordinates-container'>
        <ParallelCoordinatesPlot
          dataset={parallelCoordinatesPlotData}
          pointLabels={pointLabels}
          onChangeHighlight={this.onChangeHighlight}
          onChangeToggle={this.onChangeToggle}
          colorScale={mappedColorScales[colorBy]}
          highlightId={highlightId}
          toggledId={toggledId}
          height={180}
          width={450}
          yAxisLabel={unit}
        />
      </div>
    );
  }

  /**
   * Render waterfall component
   */
  renderWaterfall(label, dataset, extent) {
    const { viewBy } = this.props;
    const { metric, unit } = this.getActiveMetricAndType();
    let highlightId;

    // encode the control value as a threshold on raw values measures
    const useThresholds = metric === 'raw values';

    let colorBy, sortBy, labelClick, toggledId, itemAxisLabel;
    if (viewBy === 'growthFactor') {
      colorBy = this.props.growthFactorColorBy;
      sortBy = sortsMap[this.props.growthFactorSortBy];
      highlightId = this.props.highlightedCellLine;
      toggledId = this.props.toggledCellLine;
      itemAxisLabel = 'Cell Line';

      // only support label clicking on by growth factor
      labelClick = this.onWaterfallLabelClick;
    } else {
      colorBy = this.props.cellLineColorBy;
      sortBy = sortsMap[this.props.cellLineSortBy];
      highlightId = this.props.highlightedGrowthFactor;
      toggledId = this.props.toggledGrowthFactor;
      itemAxisLabel = 'Growth Factor';
    }

    if (dataset) {
      return (
        <WaterfallPlot
          labelLocation='left'
          label={label}
          dataset={dataset}
          highlightId={highlightId}
          toggledId={toggledId}
          useThresholds={useThresholds}
          dataExtent={extent}
          colorScale={mappedColorScales[colorBy]}
          dataSort={sortBy}
          onChangeHighlight={this.onChangeHighlight}
          onChangeToggle={this.onChangeToggle}
          onLabelClick={labelClick}
          valueAxisLabel={unit}
          itemAxisLabel={itemAxisLabel}
          centerValue={0}
        />
      );
    }
  }

  /**
   * Render help message when no plot is shown
   */
  renderHelpMessage() {
    const { viewBy } = this.props;
    const entityName = (viewBy === 'cellLine') ? 'Cell Line' : 'Growth Factor';
    return (
      <div className="help">
        <p>Use the <strong>{entityName}</strong> filter on the left to show pAKT / pERK data for that {entityName.toLowerCase()}.</p>
        <p>The metric and concentration visualized can be switched using the <strong>Assay Parameter</strong> and <strong>Growth Factor Concentration</strong> filters. </p>
      </div>
    );
  }

  /**
   * Render waterfall plots
   */
  renderWaterfalls() {
    const { filteredData } = this.props;

    if (!filteredData || _.isEmpty(filteredData)) {
      return this.renderHelpMessage();
    }

    const times = Object.keys(filteredData);
    const sharedExtent = d3.extent(_.flatten(times.map(time => {
      return d3.extent(filteredData[time], d => d.value);
    })).concat([0])); // add 0 so it is always included in the extent

    const colSizes = {
      sm: 6,
      md: 4,
      lg: times.length > 3 ? 3 : 4
    };

    return (
      <div className='waterfalls-container'>
        <Row>
          {times.map((time, i) => {
            const dataset = filteredData[time];
            return (
              <Col key={i} {...colSizes}>
                <AutoWidth>
                  {this.renderWaterfall(time, dataset, sharedExtent)}
                </AutoWidth>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }

  /**
   * Render controls for growth factor viewby
   */
  renderGrowthFactorChartControls() {
    const { growthFactorColorBy, growthFactorSortBy } = this.props;
    return (
      <div>
        <div className='chart-controls clearfix'>
          <div className='form-group'>
            <label className='small-label'>Color By</label>
            <div>
              <select className='form-control' value={growthFactorColorBy}
                  onChange={this.handleGrowthFactorColorByChange}>
                <option value='cellLineReceptorStatus'>Cell Line Receptor Status</option>
                <option value='cellLineMolecularSubtype'>Cell Line Molecular Subtype</option>
                <option value='none'>Nothing</option>
              </select>
            </div>
          </div>
          <div className='form-group'>
            <label className='small-label'>Sort By</label>
            <div>
              <select className='form-control' value={growthFactorSortBy}
                  onChange={this.handleGrowthFactorSortByChange}>
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
                <option value='growthFactor'>Growth Factor</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render controls for chart configuration
   */
  renderChartControls() {
    const { viewBy } = this.props;
    if (viewBy === 'growthFactor') {
      return this.renderGrowthFactorChartControls();
    }

    return this.renderCellLineChartControls();
  }


  /**
   * Render titles
   */
  renderSubheaders() {
    const { viewBy } = this.props;
    const activeParameter = this.getActiveParameter();
    const activeConcentration = this.getActiveConcentration();

    let label;
    if (viewBy === 'growthFactor') {
      const activeGrowthFactor = this.getActiveGrowthFactor();
      label = activeGrowthFactor && activeGrowthFactor.label;
    } else {
      const activeCellLine = this.getActiveCellLine();
      label = activeCellLine && activeCellLine.label;
    }

    return (
      <Row>
        <Col lg={6} md={6} sm={6}>
          {super.renderViewOptions()}
          <header className='view-heading'>
            <h3>{label}</h3>
            <ul className='selected-params list-inline'>
              <li>{activeParameter.label}</li>
              <li>{`${activeConcentration}ng/mL`}</li>
            </ul>
          </header>
          {this.renderChartControls()}
        </Col>
        <Col lg={6} md={6} sm={6}>
          {this.renderParallelCoordinatesPlot()}
        </Col>
      </Row>
    );
  }

  /**
   * Render titles
   */
  renderViewOptions() {
    return (
      <div>
        {this.renderSubheaders()}
      </div>
    );
  }

  renderExtraHelp() {
    return (
      <div>
        <p><a href="http://lincs.hms.harvard.edu/db/datasets/20140">Download source data</a></p>
      </div>
    );
  }

  /**
   * Main render function.
   */
  renderMain() {
    return (
      <div>
        {this.renderWaterfalls()}
      </div>
    );
  }
}

DatasetGrowthFactorPaktPerkPage.propTypes = propTypes;
DatasetGrowthFactorPaktPerkPage.contextTypes = contextTypes;
DatasetGrowthFactorPaktPerkPage.defaultProps = defaultProps;

export default connect(mapStateToProps)(DatasetGrowthFactorPaktPerkPage);
