
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
            <li role="presentation"><NavLink to="/cell_lines">Cell Lines</NavLink></li>
            <li role="presentation"><NavLink to="/drugs">Drugs</NavLink></li>
            <li role="presentation"><NavLink to="/about">About</NavLink></li>
          </ul>
        </nav>
        <IndexLink to="/"><h3 className="text-muted">HMS LINCS Cancer Browser</h3></IndexLink>
      </div>
    );
  }
}

TopNav.propTypes = propTypes;
export default TopNav;
