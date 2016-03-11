import React from 'react';
import { Link } from 'react-router';

export default class List extends React.Component {

  render() {

    const { datasets, resultingDatasetIds } = this.props;

    let datasetItems;
    if (datasets) {
      datasetItems = resultingDatasetIds.map(datasetId => {
        const dataset = datasets[datasetId];
        return (
          <li key={ dataset.id }>
            <span className="badge">{ dataset.category }</span>
            <Link to={`/Dataset/${datasetId}`}>{ dataset.name }</Link>
          </li>
        );
      });
    }


    return (
      <div>
        <Link to="/Cell/Cube" className="btn btn-lg btn-default" role="button">Cube</Link>

        <ul>
          { datasetItems }
        </ul>
      </div>
    );
  }
}
