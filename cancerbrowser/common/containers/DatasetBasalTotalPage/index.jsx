import React from 'react';
import { connect } from 'react-redux';

import { fetchDatasetIfNeeded, fetchDatasetInfo } from '../../actions/dataset';

import Heatmap from '../../components/Heatmap';


/// Specify the dataset ID here: ////
const datasetId = 'basal_total';
/////////////////////////////////////


const propTypes = {
  dispatch: React.PropTypes.func,
  datasetData: React.PropTypes.array,
  datasetInfo: React.PropTypes.object
};

function mapStateToProps(state) {
  const dataset = state.datasets.datasetsById[datasetId];

  return {
    datasetInfo: state.datasets.info.items[datasetId],
    datasetData: dataset && dataset.items
  };
}

/**
 * React container for a dataset page page - Basal Total
 */
class DatasetBasalTotalPage extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchDatasetIfNeeded(datasetId));
    dispatch(fetchDatasetInfo(datasetId));
  }

  renderHeatmap() {

    const { datasetData } = this.props;
    if(!datasetData) {
      return;
    }
    return (
      <Heatmap
        dataset={datasetData} />
    );
  }

  render() {
    const { datasetInfo } = this.props;

    return (
      <div>
        <h1>{datasetInfo && datasetInfo.label}</h1>
        {this.renderHeatmap()}
      </div>
    );
  }
}

DatasetBasalTotalPage.propTypes = propTypes;

export default connect(mapStateToProps)(DatasetBasalTotalPage);
