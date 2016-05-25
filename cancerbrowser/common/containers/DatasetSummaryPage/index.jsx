import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';


import { fetchDatasets } from '../../actions/dataset';

const propTypes = {
  dispatch: React.PropTypes.func,
  datasets: React.PropTypes.object
};

function mapStateToProps(state) {
  const datasets = state.datasets.items;

  return {
    datasets
  };
}

/**
 * Container component for contents of Company page content.
 */
class DatasetSummaryPage extends React.Component {

  /**
   * Callback function called after this component has been mounted.
   */
  componentDidMount() {
    this.props.dispatch(fetchDatasets());
  }

  renderDataset(key) {
    let dataset = this.props.datasets[key];

    return (
      <div key={key}>
        <h3>{dataset.label}</h3>
        <Link to={`/dataset/${dataset.id}`} className="btn btn-lg btn-default" role="button">View Dataset Page</Link>
      </div>
    );
  }

  /**
   * Render out JSX for DatasetSummaryPage.
   * @return {ReactElement} JSX markup.
   */
  render() {
    return (
      <div className='DatasetSummary'>
        {Object.keys(this.props.datasets).map((key) => this.renderDataset(key))}
      </div>
    );
  }
}

DatasetSummaryPage.propTypes = propTypes;

export default DatasetSummaryPage;

export default connect(mapStateToProps)(DatasetSummaryPage);
