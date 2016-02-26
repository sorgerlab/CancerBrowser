import React from 'react';

export default class Cube extends React.Component {

  render() {
    const { datasets, cells, cellsInDatasets } = this.props;

    let rows = Object.keys(datasets).map(datasetId => {
      return (
        <tr key={datasetId}>
          <th scope="row">{ datasets[datasetId].name }</th>
          <td className="success"></td>
          <td className="success"></td>
          <td></td>
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
                <th>X</th>
                <th>Y</th>
                <th>Z</th>
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
