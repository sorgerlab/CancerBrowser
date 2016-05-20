
import React from 'react';
import NavLink from './NavLink';
import { IndexLink } from 'react-router';

// import './topnav.scss';

const propTypes = {
};

/**
 * Top bar navigation component. Includes links to navigate around site.
 */
class TopNav extends React.Component {
  /**
   * Render out JSX for TopNav.
   * @return {ReactElement} JSX markup.
   */
  render() {
    return (
      <div className="header clearfix">
        <nav>
          <ul className="nav nav-pills pull-right">
            <li role="presentation" className="active"><IndexLink to="/">Home</IndexLink></li>
            <li role="presentation"><NavLink to="/cell">Cell Lines</NavLink></li>
            <li role="presentation"><NavLink to="/about">About</NavLink></li>
          </ul>
        </nav>
        <h3 className="text-muted">HMS LINCS Cancer Browser</h3>
      </div>
    );
  }
}

TopNav.propTypes = propTypes;
export default TopNav;
