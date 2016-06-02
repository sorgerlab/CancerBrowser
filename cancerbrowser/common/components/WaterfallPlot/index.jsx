import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';

import Waterfall from './waterfall';


import './waterfall_plot.scss';


const propTypes = {
  dataset: React.PropTypes.object,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  onChangeHighlight: React.PropTypes.func,
  labelLocation: React.PropTypes.string
};


const defaultProps = {
  width: 400,
  height: 800,
  dataSort: sortByValue
};

/**
 * Default sort function for bars if none is passed in
 * Sorts by value attribute descending.
 */
function sortByValue(a,b) {
  return b.value - a.value;
}



class WaterfallPlot extends React.Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.onDeselect = this.onDeselect.bind(this);
  }

  /**
   *
   */
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  /**
   * Lifecycle callback for when the component is mounted.
   * Creates new instance of the associated D3-based table and renders it.
   */
  componentDidMount() {

    this.chart = new Waterfall(this.refs.waterfallContainer);

    this.chart.update(this.props);
    this.chart.on('highlight', this.onSelect);
    this.chart.on('unhighlight', this.onDeselect);
  }

  /**
   *
   */
  componentDidUpdate() {
    this.chart.update(this.props);
  }

  onSelect(d) {
    this.props.onChangeHighlight(d.id);
  }

  onDeselect() {

  }



  render() {
    const { dataset, labelLocation } = this.props;

    const titleClasses = classNames({
      'name': true,
      'left': labelLocation === 'left'
    });

    return (
      <div ref='waterfallContainer' className='WaterfallPlot'>
        <div className={titleClasses}>{dataset.label}</div>

      </div>
    );
  }
}

WaterfallPlot.propTypes = propTypes;
WaterfallPlot.defaultProps = defaultProps;

export default WaterfallPlot;
