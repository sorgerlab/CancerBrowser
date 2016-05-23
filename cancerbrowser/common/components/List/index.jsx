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
            <Link to={`/dataset/${datasetId}`}>{ dataset.name }</Link>
          </li>
        );
      });
    }


    return (
      <div>
        <ul>
          { datasetItems }
        </ul>
      </div>
    );
  }
}

List.propTypes = propTypes;

export default List;
