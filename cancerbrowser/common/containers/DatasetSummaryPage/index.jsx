import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col } from 'react-bootstrap';
import markdown from 'markdown-to-jsx';

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
        <img className='dataset-thumbnail' src={datasetImageUrl(dataset)} />
        <h4>{dataset.label}</h4>
        {dataset.description ? markdown(dataset.description) : null}
        <Link to={`/dataset/${dataset.id}`}>View Dataset Page</Link>
      </li>
    );
  }

  /**
   * Render out JSX for DatasetSummaryPage.
   * @return {ReactElement} JSX markup.
   */
  render() {
    return (
      <div className='DatasetSummaryPage'>
        <Row>
          <Col md={6}>
            <h1>Datasets</h1>
            <ul className='datasets-listing list-unstyled'>
              {Object.keys(this.props.datasets).map((key) => this.renderDataset(key))}
            </ul>
          </Col>
        </Row>
      </div>
    );
  }
}

DatasetSummaryPage.propTypes = propTypes;

export default DatasetSummaryPage;

export default connect(mapStateToProps)(DatasetSummaryPage);
