import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import {
  fetchCellLineInfoIfNeeded
} from '../../actions/cell_line';

const propTypes = {
  dispatch: React.PropTypes.func,
  cellLineInfo: React.PropTypes.object,
  params: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    cellLineInfo: state.cellLines.info
  };
}

class CellLineDetailPage extends React.Component {

  componentDidMount() {
    const cellLineId = this.props.params.cellLineId;
    this.props.dispatch(fetchCellLineInfoIfNeeded(cellLineId));
  }

  /**
  * Render out JSX for CellDetail.
  * @return {ReactElement} JSX markup.
  */
  render() {

    const cellLine = this.props.cellLineInfo;
    console.log(cellLine);

    return (
      <div>
        <Link to="/cell_lines" className="btn btn-lg btn-default" role="button">Cell Line Browser</Link>
        <h1>{ cellLine.name }</h1>
        <p>General Information</p>
        <table>
          <tbody>
            <tr>
              <td>Clinical subtype</td>
            <td>{ cellLine['Details of Cell Type'] }</td>
            </tr>
            <tr>
              <td>Transcription Subtype</td>
              <td>Non-malignant Basal</td>
            </tr>
            <tr>
              <td>HMS LINCS ID</td>
            <td>{ cellLine.lincs_id }</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

CellLineDetailPage.propTypes = propTypes;

export default connect(mapStateToProps)(CellLineDetailPage);
