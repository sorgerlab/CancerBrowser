import React from 'react';
import { connect } from 'react-redux';
import DatasetBasePage, { baseMapStateToProps } from '../DatasetBasePage';

import {
  changeActiveFilters
} from '../../actions/datasetBasalPhospho';

import Heatmap from '../../components/Heatmap';

import { getFilteredViewData, getFilterGroups } from '../../selectors/datasetBasalPhospho';

/// Specify the dataset ID here: ////
const datasetId = 'basal_phospho';
const datasetKey = 'datasetBasalPhospho';
/////////////////////////////////////


const propTypes = {
  dispatch: React.PropTypes.func,
  datasetData: React.PropTypes.array,
  datasetInfo: React.PropTypes.object
};


const defaultProps = {
  className: 'DatasetBasalPhosphoPage'
};

function mapStateToProps(state) {

  const baseProps = baseMapStateToProps(state, { datasetId, datasetKey,
    getFilteredViewData, getFilterGroups });

  const props = Object.assign(baseProps, { });

  return props;
}

/**
 * React container for a dataset page page - Basal Phospho
 */
class DatasetBasalPhosphoPage extends DatasetBasePage {
  constructor(props) {
    super(props, [], () => {}, changeActiveFilters);
  }


  /**
   * Render heatmap component
   */
  renderHeatmap() {

    const { filteredData } = this.props;
    if(!filteredData) {
      return;
    }
    return (
      <Heatmap
        dataset={filteredData} />
    );
  }

  renderExtraHelp() {
    return (
      <div>
        <p><a href="http://lincs.hms.harvard.edu/data/basal_phosphoproteome-numerical_view.tsv">
          Download source data
        </a></p>
      </div>
    );
  }

  /**
   * Main render function
   */
  renderMain() {

    return (
      <div>
        {this.renderHeatmap()}
      </div>
    );
  }
}

DatasetBasalPhosphoPage.propTypes = propTypes;
DatasetBasalPhosphoPage.defaultProps = defaultProps;

export default connect(mapStateToProps)(DatasetBasalPhosphoPage);
