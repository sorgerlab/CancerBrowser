import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import PageLayout from '../../components/PageLayout';
import OmniSearch from '../../components/OmniSearch';

import './home_page.scss';

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
    cellLines: state.cellLines.items,
    drugs: state.drugs.filtered
  };
}

class HomePage extends React.Component {

  /**
   *
   */
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(fetchCellLinesIfNeeded());
    dispatch(fetchDrugsIfNeeded({}, {}));
  }

  /**
   *
   */
  renderSearch() {
    const { cellLines, drugs } = this.props;

    return (
      <OmniSearch cellLines={cellLines} drugs={drugs} />
    );
  }


  /**
   *
   */
  render() {
    return (
      <PageLayout className="HomePage">
        <h1>HMS LINCS Cancer Browser</h1>
        <p className='subtitle'>Select a Specific Cell Line or Drug to Explore</p>
        <div className='omni-search-container'>
          {this.renderSearch()}
        </div>

        <p className='subtitle'>Browse All Cell Lines or Drugs</p>

        <Link to="/cell_lines" className="btn btn-default spaced-right" role="button">Cell Line Browser</Link>
        <Link to="/drugs" className="btn btn-default" role="button">Drug Browser</Link>
      </PageLayout>
    );
  }
}

HomePage.propTypes = propTypes;

export default connect(mapStateToProps)(HomePage);
