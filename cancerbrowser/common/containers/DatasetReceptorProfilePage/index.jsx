import React from 'react';
import { connect } from 'react-redux';

import { fetchDatasetIfNeeded, fetchDatasetInfo } from '../../actions/dataset';

import WaterfallSmallMults from '../../components/WaterfallSmallMults';


/// Specify the dataset ID here: ////
const datasetId = 'receptor_profile';
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
 * React container for a dataset page page - Receptor Profile
 */
class DatasetReceptorProfilePage extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchDatasetIfNeeded(datasetId));
    dispatch(fetchDatasetInfo(datasetId));
  }

  renderSmallMults() {
    const { datasetData } = this.props;

    if(datasetData) {
      return (
        <WaterfallSmallMults
          datasets={datasetData} />
      );
    }
  }

  render() {
    const { datasetInfo } = this.props;

    return (
      <div>
        <h1>{datasetInfo && datasetInfo.label}</h1>
        {this.renderSmallMults()}
      </div>
    );
  }
}

DatasetReceptorProfilePage.propTypes = propTypes;

export default connect(mapStateToProps)(DatasetReceptorProfilePage);
