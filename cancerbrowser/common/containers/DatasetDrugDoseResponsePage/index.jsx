import React from 'react';
import { connect } from 'react-redux';

import { fetchDatasetIfNeeded, fetchDatasetInfo } from '../../actions/dataset';


/// Specify the dataset ID here: ////
const datasetId = 'drug_dose_response';
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
 * React container for a dataset page page - Drug Dose Response
 */
class DatasetDrugDoseResponsePage extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchDatasetIfNeeded(datasetId));
    dispatch(fetchDatasetInfo(datasetId));
  }

  render() {
    const { datasetInfo } = this.props;

    return (
      <div>
        <h1>{datasetInfo && datasetInfo.label}</h1>
      </div>
    );
  }
}

DatasetDrugDoseResponsePage.propTypes = propTypes;

export default connect(mapStateToProps)(DatasetDrugDoseResponsePage);
