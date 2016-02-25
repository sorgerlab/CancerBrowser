import React from 'react';

export default class Table extends React.Component {
  render() {
    return (

      <div className="row">
        <div className="col-lg-1"></div>
        <div className="col-lg-10 cbtable">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>X</th>
                <th>Y</th>
                <th>Z</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td className="success"></td>
                <td className="success"></td>
                <td className="success"></td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td className="success"></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td></td>
                <td></td>
                <td className="success"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-lg-1"></div>
      </div>


    );
  }
}
