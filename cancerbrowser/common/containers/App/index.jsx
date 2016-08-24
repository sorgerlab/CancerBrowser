import React from 'react';
import {connect} from 'react-redux';

import TopNav from '../../components/TopNav';

import {
  fetchCellLinesIfNeeded
} from '../../actions/cell_line';

import {
  fetchDrugsIfNeeded
} from '../../actions/drug';

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
          <p>© 2016 Sorger Lab, Harvard Medical School</p>
        </footer>

      </div>
    );
  }
}

App.propTypes = propTypes;

export default connect(mapStateToProps)(App);
