import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import OmniSearch from '../../components/OmniSearch';

import {
  fetchCellLinesIfNeeded
} from '../../actions/cell_line';

import {
  fetchDrugsIfNeeded
} from '../../actions/drug';


const propTypes = {
  dispatch: React.PropTypes.func,
  cellLines: React.PropTypes.array,
  drugs: React.PropTypes.array
};


/**
 *
 */
function mapStateToProps(state) {
  return {
    cellLines: state.cellLines.filtered,
    drugs: state.drugs.filtered
  };
}

class HomePage extends React.Component {

  /**
   *
   */
  componentDidMount() {
    this.props.dispatch(fetchCellLinesIfNeeded({}, {}));
    this.props.dispatch(fetchDrugsIfNeeded({}, {}));
  }

  /**
   *
   */
  renderSearch() {
    return (
      < OmniSearch
        cellLines = {this.props.cellLines}
        drugs = {this.props.drugs}
      />
    );
  }


  /**
   *
   */
  render() {
    return (
      <div className="HomePage">
        <h1>HMS LINCS Cancer Browser</h1>
        {this.renderSearch()}

        <Link to="/cell_lines" className="btn btn-lg btn-default" role="button">Cell Line Browser</Link>
        <Link to="/drugs" className="btn btn-lg btn-default" role="button">Drug Browser</Link>
      </div>
    );
  }
}

HomePage.propTypes = propTypes;

export default connect(mapStateToProps)(HomePage);
