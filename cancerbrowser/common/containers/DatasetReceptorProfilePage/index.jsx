import React from 'react';
import { connect } from 'react-redux';

import { fetchDatasetIfNeeded, fetchDatasetInfo } from '../../actions/dataset';

import { changeHighlight,
         changeActiveLeft } from '../../actions/receptor_profile';

import PageLayout from '../../components/PageLayout';
import WaterfallPlot from '../../components/WaterfallPlot';
import WaterfallSmallMults from '../../components/WaterfallSmallMults';


/// Specify the dataset ID here: ////
const datasetId = 'receptor_profile';
/////////////////////////////////////


const propTypes = {
  dispatch: React.PropTypes.func,
  datasetData: React.PropTypes.array,
  datasetInfo: React.PropTypes.object,
  highlightId: React.PropTypes.string,
  activeLeft: React.PropTypes.string,
  activeRight: React.PropTypes.string
};

const defaultProps = {
  activeLeft: 'bt-20',
  activeRight: 'bt-483'
};

function mapStateToProps(state) {
  const dataset = state.datasets.datasetsById[datasetId];

  return {
    datasetInfo: state.datasets.info.items[datasetId],
    datasetData: dataset && dataset.items,
    highlightId: state.receptorProfile.highlight,
    activeLeft: state.receptorProfile.activeLeft,
    activeRight: state.receptorProfile.activeRight
  };
}

/**
 * React container for a dataset page page - Receptor Profile
 */
class DatasetReceptorProfilePage extends React.Component {

  constructor(props) {
    super(props);

    this.onChangeHighlight = this.onChangeHighlight.bind(this);
    this.onChangeActive = this.onChangeActive.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchDatasetIfNeeded(datasetId));
    dispatch(fetchDatasetInfo(datasetId));
  }

  onChangeHighlight(highlightId) {
    const { dispatch } = this.props;
    dispatch(changeHighlight(highlightId));
  }

  onChangeActive(activeId) {
    const { dispatch } = this.props;
    dispatch(changeActiveLeft(activeId));
  }

  renderSmallMults(datasets) {
    const { highlightId, activeLeft, activeRight } = this.props;
    if(datasets) {
      return (
        <WaterfallSmallMults
          datasets={datasets}
          highlightId={highlightId}
          onChangeActive={this.onChangeActive}
          activeLeft={activeLeft}
          activeRight={activeRight}
          dataExtent={[-8,1]} />
      );
    }
  }

  renderWaterfall(dataset, labelLocation) {
    const { highlightId } = this.props;

    if(dataset) {
      return (
        <WaterfallPlot
          dataset={dataset}
          labelLocation={labelLocation}
          onChangeHighlight={this.onChangeHighlight}
          highlightId={highlightId}
          dataExtent={[-8,1]} />
      );
    }
  }

  getData(datasets, activeId) {
    if(datasets && activeId) {

      const dataset = datasets.filter((d) => d.id === activeId)[0];
      return dataset;

    } else {
      return undefined;
    }
  }

  render() {
    const { datasetInfo, datasetData, activeLeft, activeRight } = this.props;

    const leftData = this.getData(datasetData, activeLeft);
    const rightData = this.getData(datasetData, activeRight);

    if(!datasetData) {
      return (
        <div></div>
      );
    }

    return (
      <PageLayout className="DatasetReceptorProfilePage">
        <h1>{datasetInfo && datasetInfo.label}</h1>
        <div className='row'>
          <div className='col-md-4'>
            {this.renderWaterfall(leftData, 'left')}
          </div>
          <div className='col-md-4'>
            {this.renderWaterfall(rightData, 'left')}
          </div>
          <div className='col-md-4'>
            {this.renderSmallMults(datasetData)}
          </div>

        </div>
      </PageLayout>
    );
  }
}

DatasetReceptorProfilePage.propTypes = propTypes;
DatasetReceptorProfilePage.defaultProps = defaultProps;

export default connect(mapStateToProps)(DatasetReceptorProfilePage);
