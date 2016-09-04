import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router';

import TopNav from '../../components/TopNav';
import FeedbackMailto from '../../components/FeedbackMailto';

import {
  fetchCellLinesIfNeeded
} from '../../actions/cell_line';

import {
  fetchDrugsIfNeeded
} from '../../actions/drug';

import {
  fetchDatasetsInfoIfNeeded
} from '../../actions/dataset';

const propTypes = {
  dispatch: React.PropTypes.func,
  children: React.PropTypes.object
};

function mapStateToProps() {
  return {};
}

/**
 * Root container
 */
class App extends React.Component {

  componentDidMount() {
    const {dispatch} = this.props;

    // The data in this application is very small and can be loaded
    // up-front. The loading mechanism ensures that this does not reoccur
    dispatch(fetchCellLinesIfNeeded());
    dispatch(fetchDrugsIfNeeded());
    dispatch(fetchDatasetsInfoIfNeeded());
  }


  /**
  * Render out JSX for CancerBrowser.
  * @return {ReactElement} JSX markup.
  */
  render() {
    return (
      <div className="container-fluid">
        <div className='top-nav'>
          <TopNav />
        </div>

        <div className='content'>
          {this.props.children}
        </div>

        <footer className="main-footer">

          <p>Notice: This website is subject to continuous development, and we
          welcome your feedback at <FeedbackMailto/>.</p>

          <p>Please see our <Link to="/about">About page</Link> and the <a
          href="http://lincs.hms.harvard.edu/terms/">HMS LINCS Terms of
          Use</a> regarding use and citation of the published and
          unpublished data presented here.</p>

          <p>© 2016 Sorger Lab, Harvard Medical School</p>

        </footer>

      </div>
    );
  }
}

App.propTypes = propTypes;

export default connect(mapStateToProps)(App);
