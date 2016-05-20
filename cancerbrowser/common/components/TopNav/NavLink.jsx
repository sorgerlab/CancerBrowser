
import React from 'react';
import { Link } from 'react-router';

/**
 * Navigational link component. Handles setting active class of links when
 * routed to parent page.
 */
class NavLink extends React.Component {
  /**
   * Render out JSX for NavLink.
   * @return {ReactElement} JSX markup.
   */
  render() {
    return <Link {...this.props} activeClassName="active"/>;
  }
}

export default NavLink;
