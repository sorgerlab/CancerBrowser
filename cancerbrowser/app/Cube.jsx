import React from 'react';
import { Link } from 'react-router';

export default class Cube extends React.Component {

  render() {

    const { datasets, resultingDatasetIds, cells, subtypes, resultingCellIds, cellsInDatasets } = this.props;

    // Headers are the datasets
    let headers = resultingDatasetIds.map(datasetId => {
      let dataset = datasets[datasetId];

      return (
        <th key={ datasetId } className="rotate-45">
          <div>
            <span><Link to={`/Dataset/${datasetId}`}>{ dataset.name }</Link></span>
          </div>
        </th>
      );
    });


    let rows = resultingCellIds.map(cellId => {
      let cell = cells[cellId];

      let subtypeBadges = cell.subtypes.map(subtypeId => {
        const subtypeName = subtypes[subtypeId];
        return (
          <span key={ subtypeId } className="badge">{ subtypeName } </span>
        );
      });

      let columns = resultingDatasetIds.map(datasetId => {

        if (cellsInDatasets[datasetId] && cellsInDatasets[datasetId].indexOf(cellId) != -1) {
          return (
            <td key={ datasetId } className="success"></td>
          );
        }

        return (
          <td key={ datasetId }></td>
        )
      });

      return (
        <tr key={ cellId }>
          <th scope="row">{ subtypeBadges }<Link to={`/Cell/Detail/${cellId}`}>{ cell.name }</Link></th>
          { columns }
        </tr>
      );
    });

    return (
      <div>
        <Link to="/Cell/" className="btn btn-lg btn-default" role="button">List</Link>

        <div className="row">
          <div className="col-lg-1"></div>
          <div className="col-lg-10 cbtable">
            <table className="table table-header-rotated">
              <thead>
                <tr>
                  <th></th>
                  { headers }
                </tr>
              </thead>
              <tbody>
                { rows }
              </tbody>
            </table>
          </div>
          <div className="col-lg-1"></div>
        </div>

      </div>
    );
  }
}
