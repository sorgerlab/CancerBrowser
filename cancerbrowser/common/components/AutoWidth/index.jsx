import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
const propTypes = {
  children: React.PropTypes.object,

  /* If true, the component checks on componentDidUpdate to see if it needs to resize */
  parentMayResize: React.PropTypes.bool,

  /* If set, the default width is set to this value and the child is
     rendered. If null, the child is not rendered until a width is provided */
  defaultRenderWidth: React.PropTypes.number
};

const defaultProps = {
  parentMayResize: false,
  defaultRenderWidth: null
};

/**
 * Component for automatically setting a width prop to the DOM node of the first child
 */
class AutoWidth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: props.defaultRenderWidth
    };

    this.updateWidth = _.debounce(this.updateWidth.bind(this), 100);
  }

  componentDidMount() {
    this.updateWidth();
    window.addEventListener('resize', this.updateWidth);
  }

  componentWillUnmount() {
    this.updateWidth.cancel();
    window.removeEventListener('resize', this.updateWidth);
  }

  componentDidUpdate() {
    const { parentMayResize } = this.props;

    // have to update width of the parent can cause a resize without a window resize
    // e.g. something collapses or expands.
    if (parentMayResize) {
      this.updateWidth();
    }
  }

  // Call set state to update the width so it starts an update of the child component
  updateWidth() {
    const { width } = this.state;
    const domWidth = this.getResizeDOMNode().offsetWidth;
    if (width !== domWidth) {
      this.setState({
        width: this.getResizeDOMNode().offsetWidth
      });
    }
  }

  getResizeDOMNode() {
    return ReactDOM.findDOMNode(this);
  }

  render() {
    const { width } = this.state;

    if (React.Children.count(this.props.children) > 1) {
      console.warn('AutoWidth only works with a single child element.');
    }

    const child = this.props.children;
    let childToRender;

    // if we have a child and a width is provided, render the child with the width as a prop
    if (child && width != null) {
      childToRender = React.cloneElement(child, { width: this.state.width });
    }

    return <div className='auto-width'>{childToRender}</div>;
  }
}

AutoWidth.propTypes = propTypes;
AutoWidth.defaultProps = defaultProps;

export default AutoWidth;
