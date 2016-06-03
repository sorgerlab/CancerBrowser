import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import d3 from 'd3';

import { getFilteredViewData, getFilterGroups } from '../../selectors/datasetGrowthFactorPaktPerk';
import { getFilterValue, getFilterValueItem } from '../../utils/filter_utils';
import DatasetBasePage, { baseMapStateToProps } from '../DatasetBasePage';

import {
  changeActiveFilters,
  changeViewBy,
  changeHighlight
} from '../../actions/datasetGrowthFactorPaktPerk';

import WaterfallPlot from '../../components/WaterfallPlot';

import './dataset_growth_factor_pakt_perk_page.scss';

/// Specify the dataset ID here: ////
const datasetId = 'growth_factor_pakt_perk';
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
  className: React.PropTypes.string
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
    highlightId: datasetGrowthFactorPaktPerk.highlight
  });

  return props;
}

const viewOptions = [
  { label: 'Growth Factor', value: 'growthFactor'},
  { label: 'Cell Line', value: 'cellLine' }
];

/**
 * React container for a dataset page page - Growth Factor pAKT/pERK page
 */
class DatasetGrowthFactorPaktPerkPage extends DatasetBasePage {
  constructor(props) {
    super(props, viewOptions, changeViewBy, changeActiveFilters);
    this.renderWaterfall = this.renderWaterfall.bind(this);
    this.renderWaterfalls = this.renderWaterfalls.bind(this);
    this.onChangeHighlight = this.onChangeHighlight.bind(this);
    this.getActiveGrowthFactor = this.getActiveGrowthFactor.bind(this);
    this.getActiveParameter = this.getActiveParameter.bind(this);
    this.getActiveMetricAndType = this.getActiveMetricAndType.bind(this);
    this.getActiveConcentration = this.getActiveConcentration.bind(this);
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

  renderWaterfall(label, dataset, extent) {
    const { highlightId } = this.props;

    if(dataset) {
      return (
        <WaterfallPlot
          labelLocation='left'
          label={label}
          dataset={dataset}
          onChangeHighlight={this.onChangeHighlight}
          highlightId={highlightId}
          useThresholds={false}
          dataExtent={extent}
        />
      );
    }
  }

  renderWaterfalls() {
    const { filteredData } = this.props;
    if (!filteredData || _.isEmpty(filteredData)) {
      return null;
    }

    const { metric, type } = this.getActiveMetricAndType();
    const concentration = this.getActiveConcentration();
    const times = Object.keys(filteredData[metric][type][concentration]);

    const sharedExtent = d3.extent(_.flatten(times.map(time => {
      return d3.extent(filteredData[metric][type][concentration][time], d => d.value);
    })));

    return (
      <div className='waterfalls-container'>
        <div className='row'>
          {times.map((time, i) => {
            const dataset = filteredData[metric][type][concentration][time];
            return <div key={i} className='col-md-4'>{this.renderWaterfall(time, dataset, sharedExtent)}</div>;
          })}
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
