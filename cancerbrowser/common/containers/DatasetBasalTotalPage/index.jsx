import React from 'react';
import { connect } from 'react-redux';
import DatasetBasePage, { baseMapStateToProps } from '../DatasetBasePage';

import {
  changeActiveFilters
} from '../../actions/datasetBasalTotal';

import Heatmap from '../../components/Heatmap';

import { getFilteredViewData, getFilterGroups } from '../../selectors/datasetBasalTotal';

/// Specify the dataset ID here: ////
const datasetId = 'basal_total';
const datasetKey = 'datasetBasalTotal';
/////////////////////////////////////


const propTypes = {
  dispatch: React.PropTypes.func,
  datasetData: React.PropTypes.array,
  datasetInfo: React.PropTypes.object
};


const defaultProps = {
  className: 'DatasetBasalTotalPage'
};

function mapStateToProps(state) {

  const baseProps = baseMapStateToProps(state, { datasetId, datasetKey,
    getFilteredViewData, getFilterGroups });

  const props = Object.assign(baseProps, { });

  return props;
}

/**
 * React container for a dataset page page - Basal Total
 */
class DatasetBasalTotalPage extends DatasetBasePage {
  constructor(props) {
    super(props, [], () => {}, changeActiveFilters);
  }


  /**
   * Render Heatmap component
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
        <p><a href="http://lincs.hms.harvard.edu/data/basal_total_proteome-numerical_view.tsv">
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

DatasetBasalTotalPage.propTypes = propTypes;
DatasetBasalTotalPage.defaultProps = defaultProps;

export default connect(mapStateToProps)(DatasetBasalTotalPage);
