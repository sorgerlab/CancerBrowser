import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { fetchDatasetDetailIfNeeded } from '../actions';
import { fetchNeeds } from '../utils/fetchData';

import * as actionCreators from '../actions';
import { bindActionCreators } from 'redux';

class DatasetDetail extends React.Component {

  static needs = [
    fetchDatasetDetailIfNeeded
  ];

  componentDidMount() {
    fetchNeeds(this.props, DatasetDetail.needs);
  }

  render() {
    let datasetDetail = "No details";
    if (this.props.datasetDetail) {
      datasetDetail = this.props.datasetDetail.id
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
  console.log('mapStateToProps');
  console.log(state);
  const datasetDetails = state.datasetDetails;

  return {
    datasetDetails
  }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const datasetDetails = stateProps.datasetDetails;
  const datasetId = ownProps.routeParams.datasetId
  let item = undefined;

  if (datasetDetails && datasetDetails.hasOwnProperty(datasetId)) {
    const datasetDetail = datasetDetails[datasetId];

    if (!datasetDetail.isFetching && datasetDetail.hasOwnProperty('item')) {
      item = datasetDetail.item;
    }
  }

  return Object.assign({}, dispatchProps, ownProps, {
    datasetDetail: item
  })
}

export default connect(mapStateToProps, undefined, mergeProps)(DatasetDetail);
