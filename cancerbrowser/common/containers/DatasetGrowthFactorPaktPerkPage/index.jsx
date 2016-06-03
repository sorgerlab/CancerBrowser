import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import d3 from 'd3';

import { getFilteredViewData, getFilterGroups } from '../../selectors/datasetGrowthFactorPaktPerk';

import DatasetBasePage, { baseMapStateToProps } from '../DatasetBasePage';

import {
  changeActiveFilters,
  changeViewBy,
  changeHighlight
} from '../../actions/datasetGrowthFactorPaktPerk';

import WaterfallPlot from '../../components/WaterfallPlot';

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
    if (!filteredData) {
      return null;
    }

    const metric = 'fold change';
    const type = 'pAkt';
    const times = ['10min', '30min', '90min'];

    const sharedExtent = d3.extent(_.flatten(times.map(time => {
      return d3.extent(filteredData[metric][type][time], d => d.value);
    })));

    return (
      <div className='row'>
        {times.map((time, i) => {
          const dataset = filteredData[metric][type][time];
          return <div key={i} className='col-md-4'>{this.renderWaterfall(time, dataset, sharedExtent)}</div>;
        })}
      </div>
    );
  }

  renderGrowthFactorView() {
    return (
      <div>
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
