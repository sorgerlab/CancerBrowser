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

class DatasetDetailPage extends React.Component {

  componentDidMount() {
    this.props.dispatch(fetchDatasetDetailIfNeeded(this.props.params));
    this.props.dispatch(fetchDatasetInfo(this.props.params));
  }

  renderTable() {
    let columnSet = [];
    let data = [];
    if(this.props.datasetDetail) {
      columnSet = Object.keys(this.props.datasetDetail[0]).map((k) => {
        return {prop: k, title: k, render(val) { return val; }};
      });
      data = this.props.datasetDetail;
    }
    return (
      <SortableTable
        className="CellLineTable"
        keys={[this.props.datasetInfo.cell_line_id]}
        initialData={data}
        columns={columnSet}
        initialPageLength={30}
        paginate={true}
        initialSortBy={{ prop: 'cellLine', order: 'descending' }}
      />
    );
  }

  render() {

    return (
      <div>
        <h1>{this.props.datasetInfo.label}</h1>

        {this.renderTable()}


      </div>
    );
  }
}



DatasetDetailPage.propTypes = propTypes;

export default connect(mapStateToProps, undefined, mergeProps)(DatasetDetailPage);
