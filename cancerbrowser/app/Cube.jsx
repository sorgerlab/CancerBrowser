import React from 'react';

export default class Cube extends React.Component {

  render() {

    const { datasets, resultingDatasetIds, cells, resultingCellIds, cellsInDatasets } = this.props;

    let columns = resultingCellIds.map(cellId => {
      let cell = cells[cellId];

      return (
        <th key={ cellId }>{ cell.name }</th>
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

      <div className="row">
        <div className="col-lg-1"></div>
        <div className="col-lg-10 cbtable">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Datasets</th>
                { columns }
              </tr>
            </thead>
            <tbody>
              { rows }
            </tbody>
          </table>
        </div>
        <div className="col-lg-1"></div>
      </div>


    );
  }
}
