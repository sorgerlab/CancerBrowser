import React from 'react';
import classNames from 'classnames';

import './page_layout.scss';

const propTypes = {
  sidebar: React.PropTypes.any,
  children: React.PropTypes.any,
  className: React.PropTypes.string
};

class PageLayout extends React.Component {
  render() {
    const { sidebar, children, className } = this.props;
    return (
      <div className={classNames('page-with-sidebar page', className)}>
        {sidebar ? <div className='page-sidebar-bg' /> : null}
        {sidebar ? (
          <div className='page-sidebar'>
            {sidebar}
          </div>) : null}
        <div className='page-main'>
          {children}
        </div>
    </div>
    );
  }
}

PageLayout.propTypes = propTypes;

export default PageLayout;
