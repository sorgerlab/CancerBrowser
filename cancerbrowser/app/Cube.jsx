import React from 'react';
import { Link } from 'react-router';

export default class Cube extends React.Component {

  render() {

    const { datasets, resultingDatasetIds, cells, resultingCellIds, cellsInDatasets } = this.props;

    let headers = resultingCellIds.map(cellId => {
      let cell = cells[cellId];

      return (
        <th key={ cellId } className="rotate-45"><div><span>{ cell.name }</span></div></th>
      )
    });

    let rows = resultingDatasetIds.map(datasetId => {
      let dataset = datasets[datasetId];

      let columns = resultingCellIds.map(cellId => {

        if (cellsInDatasets[datasetId] && cellsInDatasets[datasetId].indexOf(cellId) != -1) {
          return (
            <td key={ cellId } className="success"></td>
          )
        }

        return (
          <td key={ cellId }></td>
        )
      });

      return (
        <tr key={ datasetId }>
          <th scope="row">{ dataset.name }</th>
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
                  <th key='datasets' className="rotate-45"><div><span>Datasets</span></div></th>
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
