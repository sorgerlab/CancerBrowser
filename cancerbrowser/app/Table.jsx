import React from 'react';

export default class Table extends React.Component {

  constructor() {
    super();

    this.state = {
      cells: {
        "47": {
                "name": "184B5",
                "lincs_id": "50576"
        },
        "48": {
            "name": "AU565",
            "lincs_id": "50091"
        }
      },
      datasets: {
        "1": { "name": "Dataset1" },
        "2": { "name": "AU565" }
      },
      "cellsInDatasets": {
        "1": {
          "cells": [
            47,
            48,
          ]
        },
        "2": {
          "cells": [
            47,
          ]
        },
        "3": {
          "cells": [
            48,
          ]
        },
        "4": {
          "cells": []
        }
      }
    }
  }

  render() {

    let rows = Object.keys(this.state.datasets).map(datasetId => {
      return (
        <tr key={datasetId}>
          <th scope="row">{ this.state.datasets[datasetId].name }</th>
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
