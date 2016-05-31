import React from 'react';
import { connect } from 'react-redux';

import { fetchDatasetDetailIfNeeded, fetchDatasetInfo } from '../../actions/dataset';

import SortableTable from '../../components/SortableTable';

const propTypes = {
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object,
  datasetDetail: React.PropTypes.array,
  datasetInfo: React.PropTypes.object
};

function mapStateToProps(state) {
  const datasetDetails = state.datasetDetails;

  return {
    datasetDetails
  };
}

//TODO: is this really necessary or could we just get the
//  right values in mapStateToProps directly?
function mergeProps(stateProps, dispatchProps, ownProps) {
  const datasetDetails = stateProps.datasetDetails;
  const datasetId = ownProps.routeParams.datasetId;
  let item = undefined;
  let info = {};

  if (datasetDetails && datasetDetails.hasOwnProperty(datasetId)) {
    const datasetDetail = datasetDetails[datasetId];

    if (!datasetDetail.isFetching && datasetDetail.hasOwnProperty('item')) {
      item = datasetDetail.item;
      info = datasetDetails.datasetInfo;
    }
  }

  return Object.assign({}, dispatchProps, ownProps, {
    datasetDetail: item,
    datasetInfo: info
  });
}

/**
 * React container for DatasetDetails page.
 */
class DatasetDetailPage extends React.Component {

  componentDidMount() {
    this.props.dispatch(fetchDatasetDetailIfNeeded(this.props.params));
    this.props.dispatch(fetchDatasetInfo(this.props.params));
  }

  render() {
    console.log(this.props.datasetDetail);
    return (
      <div>
        <h1>{this.props.datasetInfo.label}</h1>

      </div>
    );
  }
}

DatasetDetailPage.propTypes = propTypes;

export default connect(mapStateToProps, undefined, mergeProps)(DatasetDetailPage);
