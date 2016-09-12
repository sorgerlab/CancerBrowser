import React from 'react';

import './help_box.scss';

const propTypes = {
  title: React.PropTypes.string
};

class HelpBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    this.handleCollapseClick = this.handleCollapseClick.bind(this);
    this.handleExpandClick = this.handleExpandClick.bind(this);
  }

  handleExpandClick(event) {
    this.setState({expanded: true});
  }

  handleCollapseClick(event) {
    this.setState({expanded: false});
  }

  renderExpanded() {
    const { title, children } = this.props;
    return (
      <div>
      <div className="toggle" onClick={ this.handleCollapseClick }>
        hide help
      </div>
      <aside className="help-content">
        <h2>{ !!title ? title : 'Learn more' }</h2>
        { children }
      </aside>
      <div className="hidden-lg help-backdrop" onClick={ this.handleCollapseClick }></div>
      </div>
    );
  }

  renderCollapsed() {
    return (
      <div className="toggle" onClick={ this.handleExpandClick }>
        show help
      </div>
    );
  }

  render() {
    const { expanded } = this.state;
    return (
      <div className="help-box">
        { expanded ? this.renderExpanded() : this.renderCollapsed() }
      </div>
    );
  }

}

HelpBox.propTypes = propTypes;

export default HelpBox;
