import React from 'react';
import NavLink from './NavLink';
import { IndexLink } from 'react-router';

const propTypes = {
};

import logoImage from '../../assets/img/hms_lincs_logo.png';
import './top_nav.scss';

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
        <IndexLink className='navbar-brand' to='/'>
          <img className='logo' src={logoImage} />
          <span className='site-title'>Home</span>
        </IndexLink>
        <nav>
          <ul className="nav-links list-inline">
            <li role="presentation"><NavLink to="/cell_lines">Cell Lines</NavLink></li>
            <li role="presentation"><NavLink to="/drugs">Drugs</NavLink></li>
            <li role="presentation"><NavLink to="/datasets">Datasets</NavLink></li>
            <li role="presentation"><NavLink to="/about">About</NavLink></li>
          </ul>
        </nav>
      </div>
    );
  }
}

TopNav.propTypes = propTypes;
export default TopNav;
