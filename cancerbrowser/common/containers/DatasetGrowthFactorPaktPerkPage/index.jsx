import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import d3 from 'd3';

import { getFilteredViewData, getFilterGroups } from '../../selectors/datasetGrowthFactorPaktPerk';
import { getFilterValue, getFilterValueItem } from '../../utils/filter_utils';
import DatasetBasePage, { baseMapStateToProps } from '../DatasetBasePage';
import { colorScales } from '../../config/colors';
import { sortByValueAndId, sortByKey } from '../../utils/sort';

import {
  changeActiveFilters,
  changeViewBy,
  changeHighlight,
  changeGrowthFactorColorBy,
  changeGrowthFactorSortBy
} from '../../actions/datasetGrowthFactorPaktPerk';

import {
  fetchDatasetIfNeeded
} from '../../actions/dataset';

import WaterfallPlot from '../../components/WaterfallPlot';

import './dataset_growth_factor_pakt_perk_page.scss';

/// Specify the dataset ID here: ////
const datasetId = 'growth_factor_pakt_perk';
const datasetRawId = 'growth_factor_pakt_perk_raw';
const datasetKey = 'datasetGrowthFactorPaktPerk';
/////////////////////////////////////


const propTypes = {
  dispatch: React.PropTypes.func,
  datasetData: React.PropTypes.array,
  datasetInfo: React.PropTypes.object,
  highlightId: React.PropTypes.string,
  activeFilters: React.PropTypes.object,
  filterGroups: React.PropTypes.array,
  filteredCellLines: React.PropTypes.array,
  cellLineCounts: React.PropTypes.object,
  viewBy: React.PropTypes.string,
  filteredData: React.PropTypes.object,
  className: React.PropTypes.string,
  growthFactorColorBy: React.PropTypes.string,
  growthFactorSortBy: React.PropTypes.string
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
    highlightId: datasetGrowthFactorPaktPerk.highlight,
    growthFactorColorBy: datasetGrowthFactorPaktPerk.growthFactorColorBy,
    growthFactorSortBy: datasetGrowthFactorPaktPerk.growthFactorSortBy
  });

  return props;
}

const viewOptions = [
  { label: 'Growth Factor', value: 'growthFactor'},
  { label: 'Cell Line', value: 'cellLine' }
];


const mappedColorScales = {
  cellLineReceptorStatus: d => colorScales.cellLineReceptorStatusLighter(d.cell_line.receptorStatus.value),
  cellLineMolecularSubtype: d => colorScales.cellLineMolecularSubtype(d.cell_line.molecularSubtype.value),
  none: undefined
};

const sortsMap = {
  magnitude: sortByValueAndId,
  cellLine: sortByKey('label')
};

/**
 * React container for a dataset page page - Growth Factor pAKT/pERK page
 */
class DatasetGrowthFactorPaktPerkPage extends DatasetBasePage {
  constructor(props) {
    super(props, viewOptions, changeViewBy, changeActiveFilters);
    this.renderWaterfall = this.renderWaterfall.bind(this);
    this.renderWaterfalls = this.renderWaterfalls.bind(this);
    this.renderGrowthFactorChartControls = this.renderGrowthFactorChartControls.bind(this);
    this.onChangeHighlight = this.onChangeHighlight.bind(this);
    this.handleGrowthFactorColorByChange = this.handleGrowthFactorColorByChange.bind(this);
    this.handleGrowthFactorSortByChange = this.handleGrowthFactorSortByChange.bind(this);
    this.getActiveGrowthFactor = this.getActiveGrowthFactor.bind(this);
    this.getActiveParameter = this.getActiveParameter.bind(this);
    this.getActiveMetricAndType = this.getActiveMetricAndType.bind(this);
    this.getActiveConcentration = this.getActiveConcentration.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    super.componentDidMount();

    // get the extra dataset file
    dispatch(fetchDatasetIfNeeded(datasetRawId));
  }

  getActiveGrowthFactor() {
    const { filterGroups, activeFilters } = this.props;
    return getFilterValueItem(filterGroups, activeFilters, 'growthFactorConfig', 'growthFactor');
  }

  getActiveParameter() {
    const { filterGroups, activeFilters } = this.props;
    return getFilterValueItem(filterGroups, activeFilters, 'growthFactorConfig', 'parameter');
  }

  getActiveMetricAndType() {
    const parameter = this.getActiveParameter();

    if (!parameter) {
      return {};
    }

    let result = {};

    switch(parameter.value) {
      case 'paktFoldChange':
        result.metric = 'fold change';
        result.type = 'pAkt';
        break;
      case 'paktRawValues':
        result.metric = 'raw values';
        result.type = 'pAkt';
        break;
      case 'perkFoldChange':
        result.metric = 'fold change';
        result.type = 'pErk';
        break;
      case 'perkRawValues':
        result.metric = 'raw values';
        result.type = 'pErk';
        break;
    }

    return result;
  }

  getActiveConcentration() {
    return getFilterValue(this.props.activeFilters, 'growthFactorConfig', 'concentration');
  }

  onChangeHighlight(highlightId) {
    const { dispatch } = this.props;
    dispatch(changeHighlight(highlightId));
  }

  handleGrowthFactorColorByChange(evt) {
    const { value } = evt.target;
    const { dispatch } = this.props;
    dispatch(changeGrowthFactorColorBy(value));
  }

  handleGrowthFactorSortByChange(evt) {
    const { value } = evt.target;
    const { dispatch } = this.props;
    dispatch(changeGrowthFactorSortBy(value));
  }

  renderWaterfall(label, dataset, extent) {
    const { viewBy, highlightId } = this.props;
    const { metric } = this.getActiveMetricAndType();

    // encode the control value as a threshold on raw values measures
    const useThresholds = metric === 'raw values';
    let colorBy, sortBy;
    if (viewBy === 'growthFactor') {
      colorBy = this.props.growthFactorColorBy;
      sortBy = sortsMap[this.props.growthFactorSortBy];
    }

    if (dataset) {
      return (
        <WaterfallPlot
          labelLocation='left'
          label={label}
          dataset={dataset}
          onChangeHighlight={this.onChangeHighlight}
          highlightId={highlightId}
          useThresholds={useThresholds}
          dataExtent={extent}
          colorScale={mappedColorScales[colorBy]}
          dataSort={sortBy}
        />
      );
    }
  }

  renderWaterfalls() {
    const { filteredData } = this.props;
    if (!filteredData || _.isEmpty(filteredData)) {
      return null;
    }

    const times = Object.keys(filteredData);
    const sharedExtent = d3.extent(_.flatten(times.map(time => {
      return d3.extent(filteredData[time], d => d.value);
    })));

    return (
      <div className='waterfalls-container'>
        <div className='row'>
          {times.map((time, i) => {
            const dataset = filteredData[time];
            return <div key={i} className='col-md-4'>{this.renderWaterfall(time, dataset, sharedExtent)}</div>;
          })}
        </div>
      </div>
    );
  }

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

  renderGrowthFactorView() {
    const activeGrowthFactor = this.getActiveGrowthFactor();
    const activeParameter = this.getActiveParameter();
    const activeConcentration = this.getActiveConcentration();

    let label;
    if (activeGrowthFactor) {
      label = `${activeGrowthFactor.label} - ${activeParameter.label} - ${activeConcentration}ng/mL`;
    }

    return (
      <div>
        <h3>{label}</h3>
        {this.renderGrowthFactorChartControls()}
        {this.renderWaterfalls()}
      </div>
    );
  }

  renderCellLineView() {
    return (
      <div>
        TODO Cell line view
      </div>
    );
  }

  renderMain() {
    const { viewBy } = this.props;

    if (viewBy === 'growthFactor') {
      return this.renderGrowthFactorView();
    }

    return this.renderCellLineView();
  }
}

DatasetGrowthFactorPaktPerkPage.propTypes = propTypes;
DatasetGrowthFactorPaktPerkPage.defaultProps = defaultProps;

export default connect(mapStateToProps)(DatasetGrowthFactorPaktPerkPage);
