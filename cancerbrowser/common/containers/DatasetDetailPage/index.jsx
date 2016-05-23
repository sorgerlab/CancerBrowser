import React from 'react';
import { connect } from 'react-redux';

import { fetchDatasetDetailIfNeeded } from '../../actions';

const propTypes = {
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object,
  datasetDetail: React.PropTypes.object
};

class DatasetDetailPage extends React.Component {

  componentDidMount() {
    this.props.dispatch(fetchDatasetDetailIfNeeded(this.props.params));
  }

  render() {
    let datasetDetail = 'No details for this dataset';
    if (this.props.datasetDetail) {
      datasetDetail = this.props.datasetDetail.description;
    }

    return (
      <div>
        <h1>Dataset Details</h1>

        { datasetDetail }

      </div>
    );
  }
}

function mapStateToProps(state) {
  const datasetDetails = state.datasetDetails;

  return {
    datasetDetails
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const datasetDetails = stateProps.datasetDetails;
  const datasetId = ownProps.routeParams.datasetId;
  let item = undefined;

  if (datasetDetails && datasetDetails.hasOwnProperty(datasetId)) {
    const datasetDetail = datasetDetails[datasetId];

    if (!datasetDetail.isFetching && datasetDetail.hasOwnProperty('item')) {
      item = datasetDetail.item;
    }
  }

  return Object.assign({}, dispatchProps, ownProps, {
    datasetDetail: item
  });
}

DatasetDetailPage.propTypes = propTypes;

export default connect(mapStateToProps, undefined, mergeProps)(DatasetDetailPage);
