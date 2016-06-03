import React from 'react';
import { connect } from 'react-redux';

import { getFilteredViewData, getFilterGroups } from '../../selectors/datasetGrowthFactorPaktPerk';

import DatasetBasePage, { baseMapStateToProps } from '../DatasetBasePage';

import {
  changeActiveFilters,
  changeViewBy
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
  const baseProps = baseMapStateToProps(state, { datasetId, datasetKey,
    getFilteredViewData, getFilterGroups });

  const props = Object.assign(baseProps, {
    /* Add custom props here */
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

  onChangeHighlight() {

  }

  renderWaterfall(label, dataset) {
    const { highlightId } = this.props;

    if(dataset) {
      return (
        <WaterfallPlot
          labelLocation='left'
          dataset={{ label, measurements: dataset }}
          onChangeHighlight={this.onChangeHighlight}
          highlightId={highlightId}
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

    return (
      <div className='row'>
        {times.map((time, i) => {
          const dataset = filteredData[metric][type][time];
          console.log('dataset = ', dataset);
          return <div key={i} className='col-md-4'>{this.renderWaterfall(time, dataset)}</div>;
        })}
      </div>
    );
  }

  renderMain() {
    const { datasetInfo, filteredData } = this.props;

    return (
      <div>
        {this.renderWaterfalls()}
      </div>
    );
  }
}

DatasetGrowthFactorPaktPerkPage.propTypes = propTypes;
DatasetGrowthFactorPaktPerkPage.defaultProps = defaultProps;

export default connect(mapStateToProps)(DatasetGrowthFactorPaktPerkPage);
