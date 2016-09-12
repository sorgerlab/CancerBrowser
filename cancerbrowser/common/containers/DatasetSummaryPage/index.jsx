import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col } from 'react-bootstrap';

import './dataset_summary_page.scss';

const datasetImageContext = require.context('../../assets/img/datasets');
export function datasetImageUrl(dataset) {
  const filename = `${dataset.id}.jpg`;
  // All datasets are expected to have an image.
  return datasetImageContext(`./${filename}`);
}

const propTypes = {
  dispatch: React.PropTypes.func,
  datasets: React.PropTypes.object
};

/**
 * Function to map state values to component props
 * @param {Object} state Current redux state tree data store.
 * @return {Object} where keys are prop attributes
 *  and values are where to get them from the state
 */
function mapStateToProps(state) {
  return {
    datasets: state.datasets.info.primaryDatasets
  };
}

/**
 * Container component for contents of Dataset Summary page content.
 */
class DatasetSummaryPage extends React.Component {

  /**
   * Render individual dataset.
   * @return {ReactElement} JSX markup.
   */
  renderDataset(key) {
    let dataset = this.props.datasets[key];

    return (
      <li key={key} className='dataset-item clearfix'>
        <Link to={`/dataset/${dataset.id}`}>
          <img className='dataset-thumbnail' src={datasetImageUrl(dataset)} />
        </Link>
        <h4><Link to={`/dataset/${dataset.id}`}>{dataset.label}</Link></h4>
        { dataset.description }
      </li>
    );
  }

  /**
   * Render out JSX for DatasetSummaryPage.
   * @return {ReactElement} JSX markup.
   */
  render() {
    /* This is not really a "page with sidebar", but we want to push the content
       over to line up with the nav menu as though there *were* a sidebar. */
    return (
      <div className='DatasetSummaryPage page-with-sidebar'>
        <div className="page-main constrained-width-text">
          <h1>Datasets</h1>
          <ul className='datasets-listing list-unstyled'>
            {Object.keys(this.props.datasets).map((key) => this.renderDataset(key))}
          </ul>
        </div>
      </div>
    );
  }
}

DatasetSummaryPage.propTypes = propTypes;

export default DatasetSummaryPage;

export default connect(mapStateToProps)(DatasetSummaryPage);
