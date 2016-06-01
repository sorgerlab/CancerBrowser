
import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import d3 from 'd3';

import './small_waterfall.scss';

const propTypes = {
  dataset: React.PropTypes.object,
  activeKey: React.PropTypes.string,
  dataSort: React.PropTypes.func,
  dataExtent: React.PropTypes.array,
  onClick: React.PropTypes.func,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  fillColor: React.PropTypes.string,
  highlightColor: React.PropTypes.string
};

const defaultProps = {
  dataSort: sortByValue,
  width: 100,
  height: 100,
  fillColor: '#cccccc',
  highlightColor: '#9679af'
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

    const data = dataset.measurements;
    data.sort(sortFunc);

    return data;
  }

  /**
   * Rerenders the chart on the canvas. Recomputes data sorting and scales.
   */
  updateCanvas() {
    const {
      dataset,
      activeKey,
      dataSort,
      dataExtent,
      width,
      height,
      fillColor,
      highlightColor } = this.props;

    // sort and extract data to display
    const values = this.getData(dataset, dataSort);


    const ctx = this.refs.canvas.getContext('2d');

    // Scaling for retina
    let sizeScale = 1.0;
    if (window.devicePixelRatio) {
      sizeScale = window.devicePixelRatio;
    }
    ctx.scale(sizeScale, sizeScale);


    // scales recomputed each draw
    const xScale = d3.scale.linear()
      .range([0, width]);

    if(dataExtent) {
      xScale.domain(dataExtent);
    } else {
      xScale.domain(d3.extent(values, (d) => d.value));
    }

    const yScale = d3.scale.ordinal()
      .domain(values.map((v) => v.id))
      .rangeRoundBands([0, height]);


    // draw main bars
    ctx.clearRect(0,0, width, height);
    ctx.fillStyle = fillColor;

    values.forEach(function(value) {
      ctx.fillRect(0, yScale(value.id), xScale(value.value), yScale.rangeBand());
    });

    // draw highlight
    // TODO: this could be an array of highlighted values?
    if(activeKey) {

      ctx.fillStyle = highlightColor;

      const activeValue = values.filter((v) => v.id === activeKey);
      activeValue.forEach(function(value) {
        ctx.fillRect(0, yScale(value.id), xScale(value.value), yScale.rangeBand());
      });
    }
  }

  /**
   * Render the chart
   */
  render() {
    const { dataset, width, height } = this.props;

    // scaling for retina
    let sizeScale = 1.0;
    if (window.devicePixelRatio) {
      sizeScale = window.devicePixelRatio;
    }

    let canvasStyle = {
      width: width,
      height: height
    };

    return (
      <div className='SmallWaterfallPlot'  onClick={this.handleClick}>
        <div className='name'>{dataset.label}</div>
        <canvas className='chart' ref="canvas" style={canvasStyle} id={dataset.id} width={width * sizeScale} height={height * sizeScale} />
      </div>
    );
  }
}

SmallWaterfallPlot.defaultProps = defaultProps;
SmallWaterfallPlot.propTypes = propTypes;

export default SmallWaterfallPlot;
