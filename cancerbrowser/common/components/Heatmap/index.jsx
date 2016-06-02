import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import './heatmap.scss';


const propTypes = {
  data: React.PropTypes.array

};


const defaultProps = {
};


class Heatmap extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  renderRow(row) {
    return (
      <div></div>
    );
  }

  render() {

    const { data } = this.props;

    return (
      <div className="Heatmap">
        {data.map((row) => this.renderRow(row))}
      </div>
    );
  }
}

Heatmap.propTypes = propTypes;
Heatmap.defaultProps = defaultProps;

export default Heatmap;
