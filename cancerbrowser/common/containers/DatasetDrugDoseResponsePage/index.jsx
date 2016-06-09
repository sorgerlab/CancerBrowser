import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import d3 from 'd3';
import { Row, Col } from 'react-bootstrap';

import { getFilteredViewData, getFilterGroups, getWaterfallPlotData } from '../../selectors/datasetDrugDoseResponse';
import { getFilterValueItem } from '../../utils/filter_utils';
import DatasetBasePage, { baseMapStateToProps } from '../DatasetBasePage';
import { colorScales } from '../../config/colors';
import { sortByKeys, sortByKey } from '../../utils/sort';

import {
  changeActiveFilters,
  changeViewBy,
  changeHighlightedCellLine,
  changeHighlightedDrug,
  changeToggledCellLine,
  changeToggledDrug,
  changeDrugColorBy,
  changeDrugSortBy,
  changeCellLineSortBy
} from '../../actions/datasetDrugDoseResponse';

import AutoWidth from '../../components/AutoWidth';
import WaterfallPlot from '../../components/WaterfallPlot';

// import './dataset_drug_dose_response_page.scss';

/// Specify the dataset ID here: ////
const datasetId = 'drug_dose_response';
const datasetKey = 'datasetDrugDoseResponse';
/////////////////////////////////////


const propTypes = {
  dispatch: React.PropTypes.func,
  datasetData: React.PropTypes.array,
  datasetInfo: React.PropTypes.object,
  highlightedCellLine: React.PropTypes.string,
  highlightedDrug: React.PropTypes.string,
  toggledCellLine: React.PropTypes.string,
  toggledDrug: React.PropTypes.string,
  activeFilters: React.PropTypes.object,
  filterGroups: React.PropTypes.array,
  filteredCellLines: React.PropTypes.array,
  cellLineCounts: React.PropTypes.object,
  viewBy: React.PropTypes.string,
  filteredData: React.PropTypes.array,
  waterfallPlotData: React.PropTypes.object,
  className: React.PropTypes.string,
  drugColorBy: React.PropTypes.string,
  drugSortBy: React.PropTypes.string,
  cellLineColorBy: React.PropTypes.string,
  cellLineSortBy: React.PropTypes.string
};

const contextTypes = {
  router: React.PropTypes.object
};


const defaultProps = {
  className: 'DatasetDrugDoseResponsePage'
};

function mapStateToProps(state) {
  const { datasets } = state;
  const { datasetDrugDoseResponse } = datasets;

  const baseProps = baseMapStateToProps(state, { datasetId, datasetKey,
    getFilteredViewData, getFilterGroups });

  const props = Object.assign(baseProps, {
    /* Add custom props here */
    waterfallPlotData: getWaterfallPlotData(state,datasetDrugDoseResponse),
    highlightedCellLine: datasetDrugDoseResponse.highlightedCellLine,
    toggledCellLine: datasetDrugDoseResponse.toggledCellLine,
    drugColorBy: datasetDrugDoseResponse.drugColorBy,
    drugSortBy: datasetDrugDoseResponse.drugSortBy,
    highlightedDrug: datasetDrugDoseResponse.highlightedDrug,
    toggledDrug: datasetDrugDoseResponse.toggledDrug,
    cellLineSortBy: datasetDrugDoseResponse.cellLineSortBy,
    cellLineColorBy: datasetDrugDoseResponse.cellLineColorBy
  });

  return props;
}

const viewOptions = [
  { label: 'Drug', value: 'drug'},
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
  drug: sortByKey('label')
};


// define this array once
const grMaxExtent = [-1, 1];

/**
 * React container for a dataset page page - Drug Dose Response dataset page
 */
class DatasetDrugDoseResponsePage extends DatasetBasePage {
  constructor(props) {
    super(props, viewOptions, changeViewBy, changeActiveFilters);
    this.renderWaterfall = this.renderWaterfall.bind(this);
    this.renderWaterfalls = this.renderWaterfalls.bind(this);
    this.renderDrugChartControls = this.renderDrugChartControls.bind(this);
    this.onChangeHighlight = this.onChangeHighlight.bind(this);
    this.onChangeToggle = this.onChangeToggle.bind(this);
    this.onWaterfallCellLineLabelClick = this.onWaterfallCellLineLabelClick.bind(this);
    this.onWaterfallDrugLabelClick = this.onWaterfallDrugLabelClick.bind(this);
    this.handleDrugColorByChange = this.handleDrugColorByChange.bind(this);
    this.handleDrugSortByChange = this.handleDrugSortByChange.bind(this);
    this.handleCellLineSortByChange = this.handleCellLineSortByChange.bind(this);
    this.getActiveDrug = this.getActiveDrug.bind(this);
    this.getActiveCellLine = this.getActiveCellLine.bind(this);
  }

  getActiveDrug() {
    const { filterGroups, activeFilters } = this.props;
    return getFilterValueItem(filterGroups, activeFilters, 'drugConfig', 'drug');
  }

  getActiveCellLine() {
    const { filterGroups, activeFilters } = this.props;
    return getFilterValueItem(filterGroups, activeFilters, 'cellLineConfig', 'cellLine');
  }

  onChangeHighlight(highlightId) {
    const { dispatch, viewBy } = this.props;
    if (viewBy === 'drug') {
      dispatch(changeHighlightedCellLine(highlightId));
    } else {
      dispatch(changeHighlightedDrug(highlightId));
    }
  }

  onChangeToggle(toggleId) {
    const { dispatch, viewBy } = this.props;
    if (viewBy === 'drug') {
      dispatch(changeToggledCellLine(toggleId));
    } else {
      dispatch(changeToggledDrug(toggleId));
    }
  }

  onWaterfallCellLineLabelClick(datum) {
    const path = `/cell_line/${datum.cell_line.id}`;
    this.context.router.push(path);
  }

  onWaterfallDrugLabelClick(datum) {
    const path = `/drug/${datum.id}`;
    this.context.router.push(path);
  }

  handleDrugColorByChange(evt) {
    const { value } = evt.target;
    const { dispatch } = this.props;
    dispatch(changeDrugColorBy(value));
  }

  handleDrugSortByChange(evt) {
    const { value } = evt.target;
    const { dispatch } = this.props;
    dispatch(changeDrugSortBy(value));
  }

  handleCellLineSortByChange(evt) {
    const { value } = evt.target;
    const { dispatch } = this.props;
    dispatch(changeCellLineSortBy(value));
  }

  renderWaterfall(label, dataset, extent) {
    const { viewBy } = this.props;
    let highlightId;

    const valueAxisLabel = ''; // TODO set an axis label for Y

    let colorBy, sortBy, labelClick, toggledId, itemAxisLabel;
    if (viewBy === 'drug') {
      colorBy = this.props.drugColorBy;
      sortBy = sortsMap[this.props.drugSortBy];
      highlightId = this.props.highlightedCellLine;
      toggledId = this.props.toggledCellLine;
      itemAxisLabel = 'Cell Line';
      labelClick = this.onWaterfallCellLineLabelClick;
    } else {
      colorBy = this.props.cellLineColorBy;
      sortBy = sortsMap[this.props.cellLineSortBy];
      highlightId = this.props.highlightedDrug;
      toggledId = this.props.toggledDrug;
      itemAxisLabel = 'Drug';
      labelClick = this.onWaterfallDrugLabelClick;
    }

    if (dataset) {
      return (
        <WaterfallPlot
          labelLocation='left'
          label={label}
          dataset={dataset}
          highlightId={highlightId}
          toggledId={toggledId}
          useThresholds={false}
          dataExtent={extent}
          colorScale={mappedColorScales[colorBy]}
          dataSort={sortBy}
          onChangeHighlight={this.onChangeHighlight}
          onChangeToggle={this.onChangeToggle}
          onLabelClick={labelClick}
          valueAxisLabel={valueAxisLabel}
          itemAxisLabel={itemAxisLabel}
          centerValue={0}
        />
      );
    }
  }

  renderWaterfalls() {
    const { waterfallPlotData } = this.props;

    if (!waterfallPlotData || _.isEmpty(waterfallPlotData)) {
      return null;
    }

    const { gr50, grMax } = waterfallPlotData;

    const gr50Extent = d3.extent(gr50.map(d => d.value)
      .filter(d => d !== Number.POSITIVE_INFINITY && d !== Number.NEGATIVE_INFINITY)
      .concat([0]));

    return (
      <div className='waterfalls-container'>
        <Row>
          <Col md={6}>
            <AutoWidth>
              {this.renderWaterfall('GR50', gr50, gr50Extent)}
            </AutoWidth>
          </Col>
          <Col md={6}>
            <AutoWidth>
              {this.renderWaterfall('GRMax', grMax, grMaxExtent)}
            </AutoWidth>
          </Col>
        </Row>
      </div>
    );
  }

  renderDrugChartControls() {
    const { drugColorBy, drugSortBy } = this.props;
    return (
      <div>
        <div className='chart-controls clearfix'>
          <div className='form-group'>
            <label className='small-label'>Color By</label>
            <div>
              <select className='form-control' value={drugColorBy}
                  onChange={this.handleDrugColorByChange}>
                <option value='cellLineReceptorStatus'>Cell Line Receptor Status</option>
                <option value='cellLineMolecularSubtype'>Cell Line Molecular Subtype</option>
                <option value='none'>Nothing</option>
              </select>
            </div>
          </div>
          <div className='form-group'>
            <label className='small-label'>Sort By</label>
            <div>
              <select className='form-control' value={drugSortBy}
                  onChange={this.handleDrugSortByChange}>
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
                <option value='drug'>Drug</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderChartControls() {
    const { viewBy } = this.props;
    if (viewBy === 'drug') {
      return this.renderDrugChartControls();
    }

    return this.renderCellLineChartControls();
  }


  renderSubheaders() {
    const { viewBy } = this.props;

    let label;
    if (viewBy === 'drug') {
      const activeDrug = this.getActiveDrug();
      label = activeDrug && activeDrug.label;
    } else {
      const activeCellLine = this.getActiveCellLine();
      label = activeCellLine && activeCellLine.label;
    }

    return (
      <div>
        <header className='view-heading'>
          <h3>{label}</h3>
        </header>
        {this.renderChartControls()}
      </div>
    );
  }

  renderMain() {
    return (
      <div>
        {this.renderSubheaders()}
        {this.renderWaterfalls()}
      </div>
    );
  }
}

DatasetDrugDoseResponsePage.propTypes = propTypes;
DatasetDrugDoseResponsePage.contextTypes = contextTypes;
DatasetDrugDoseResponsePage.defaultProps = defaultProps;

export default connect(mapStateToProps)(DatasetDrugDoseResponsePage);
