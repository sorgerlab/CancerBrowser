import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
const propTypes = {
  children: React.PropTypes.object
};

/**
 * Component for automatically setting a width prop to the DOM node of the first child
 */
class AutoWidth extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      width: 200 // arbitrary starting number
    };

    this.updateWidth = _.debounce(this.updateWidth.bind(this), 100);
  }

  componentDidMount() {
    this.updateWidth();
    window.addEventListener('resize', this.updateWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth);
  }

  componentDidUpdate() {
    // need this here to auto resize when window size changes
    if (this.shouldUpdateWidth()) {
      this.updateWidth();
    }
  }

  // Returns true the dom node width is different than the stored state width
  shouldUpdateWidth() {
    const domWidth = this.getResizeDOMNode().offsetWidth;
    return this.state.width !== domWidth;
  }

  // Call set state to update the width so it starts an update of the child component
  updateWidth() {
    console.log('updating width!');
    this.setState({
      width: this.getResizeDOMNode().offsetWidth
    });
  }

  getResizeDOMNode() {
    return ReactDOM.findDOMNode(this);
  }

  render() {
    if (React.Children.count(this.props.children) > 1) {
      console.warn('AutoWidth only works with a single child element.');
    }

    const child = this.props.children;
    const newChild = React.cloneElement(child, { width: this.state.width });
    return <div className='auto-width'>{newChild}</div>;
  }
}

AutoWidth.propTypes = propTypes;

export default AutoWidth;
