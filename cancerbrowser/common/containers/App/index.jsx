
import React from 'react';

import TopNav from '../../components/TopNav';


const propTypes = {
  children: React.PropTypes.object
};


class App extends React.Component {
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

        <footer className="footer">
          <p>© 2016 Sorger Lab, Harvard Medical School</p>
        </footer>

      </div>
    );
  }
}

App.propTypes = propTypes;

export default App;
