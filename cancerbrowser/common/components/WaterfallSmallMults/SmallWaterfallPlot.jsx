
import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import d3 from 'd3';

import './small_waterfall.scss';

const propTypes = {
  dataset: React.PropTypes.object,
  activeKey: React.PropTypes.string,
  dataSort: React.PropTypes.func,
  dataExtent: React.PropTypes.array,
  onClick: React.PropTypes.func
};

const defaultProps = {
  dataSort: sortByValue
};

/**
 * Default sort function for bars if none is passed in
 * Sorts by value attribute descending.
 */
function sortByValue(a,b) {
  return b.value - a.value;
}

/**
 * One of the plots in the small multiples waterfall.
 */
class SmallWaterfallPlot extends React.Component {
  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    this.width = 100;
    this.height = 100;

    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Checks if component should update.
   */
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  /**
   * Update canvas when component mounts
   */
  componentDidMount() {
    this.updateCanvas();
  }

  /**
   * Update Canvas when component updates
   */
  componentDidUpdate() {
    this.updateCanvas();
  }

  handleClick() {
    const { onClick, dataset } = this.props;
    onClick(dataset.id);
  }

  /**
   * Extracts data from dataset and
   * sorts data.
   * @param {Object} dataset Dataset
   * @param (Function) sortFunc function indicating how to sort.
   */
  getData(dataset, sortFunc) {

    let data = dataset.measurements;
    data.sort(sortFunc);

    return data;
  }

  /**
   * Rerenders the chart on the canvas. Recomputes data sorting and scales.
   */
  updateCanvas() {
    const { dataset, activeKey, dataSort, dataExtent } = this.props;

    const values = this.getData(dataset, dataSort);

    const fillColor = '#cccccc';
    const highlightColor = '#9679AF';

    const ctx = this.refs.canvas.getContext('2d');

    const xScale = d3.scale.linear()
      .range([0, this.width]);

    if(dataExtent) {
      xScale.domain(dataExtent);
    } else {
      xScale.domain(d3.extent(values, (d) => d.value));
    }

    const yScale = d3.scale.ordinal()
      .domain(values.map((v) => v.id))
      .rangeRoundBands([0, this.height]);


    ctx.clearRect(0,0, this.width, this.height);

    ctx.fillStyle = fillColor;

    values.forEach(function(value) {
      ctx.fillRect(0, yScale(value.id), xScale(value.value), yScale.rangeBand());
    });

    // active measurement(s)
    if(activeKey) {

      ctx.fillStyle = highlightColor;

      var activeValue = values.filter((v) => v.id === activeKey);
      activeValue.forEach(function(value) {
        ctx.fillRect(0, yScale(value.id), xScale(value.value), yScale.rangeBand());
      });
    }
  }

  /**
   * Render the chart
   */
  render() {
    const { dataset } = this.props;

    return (
      <div className='SmallWaterfallPlot'  onClick={this.handleClick}>
        <div className='name'>{dataset.label}</div>
        <canvas className='chart' ref="canvas" id={dataset.id} width={this.width} height={this.height} />
      </div>
    );
  }
}

SmallWaterfallPlot.defaultProps = defaultProps;
SmallWaterfallPlot.propTypes = propTypes;

export default SmallWaterfallPlot;
