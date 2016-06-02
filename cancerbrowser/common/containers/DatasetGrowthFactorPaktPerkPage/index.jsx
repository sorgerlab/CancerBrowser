import React from 'react';
import { connect } from 'react-redux';

import { getFilteredViewData, getFilterGroups } from '../../selectors/datasetGrowthFactorPaktPerk';

import DatasetBasePage, { baseMapStateToProps } from '../DatasetBasePage';

import {
  changeActiveFilters,
  changeViewBy
} from '../../actions/datasetGrowthFactorPaktPerk';

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
  filteredData: React.PropTypes.array,
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
  }

  renderMain() {
    const { datasetInfo, filteredData } = this.props;

    return (
      <div>TODO Main page.</div>
    );
  }
}

DatasetGrowthFactorPaktPerkPage.propTypes = propTypes;
DatasetGrowthFactorPaktPerkPage.defaultProps = defaultProps;

export default connect(mapStateToProps)(DatasetGrowthFactorPaktPerkPage);
