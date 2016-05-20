import React from 'react';
import { Link } from 'react-router';

const propTypes = {
  datasets: React.PropTypes.object,
  resultingDatasetIds: React.PropTypes.array
};

class List extends React.Component {

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
        <Link to="/cell/Cube" className="btn btn-lg btn-default" role="button">Cube</Link>

        <ul>
          { datasetItems }
        </ul>
      </div>
    );
  }
}

List.propTypes = propTypes;

export default List;
