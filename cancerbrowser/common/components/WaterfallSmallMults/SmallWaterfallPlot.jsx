
import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import d3 from 'd3';

import { sortByKeysWithDisabled } from '../../utils/sort';

import './small_waterfall.scss';

const propTypes = {
  dataset: React.PropTypes.object,
  highlightId: React.PropTypes.string,
  toggledId: React.PropTypes.string,
  dataSort: React.PropTypes.func,
  dataExtent: React.PropTypes.array,
  onChangeActive: React.PropTypes.func,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  fillColor: React.PropTypes.string,
  highlightColor: React.PropTypes.string,
  toggledColor: React.PropTypes.string,
  isActive: React.PropTypes.bool
};

const defaultProps = {
  dataSort: sortByKeysWithDisabled(['-value', 'label'], ['label']),
  width: 100,
  height: 100,
  fillColor: '#cccccc',
  highlightColor: '#B8A2CC',
  toggledColor: '#9679af'
};


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
    const { onChangeActive, dataset } = this.props;
    onChangeActive(dataset.id);
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
      highlightId,
      toggledId,
      dataSort,
      dataExtent,
      width,
      height,
      fillColor,
      highlightColor,
      toggledColor } = this.props;

    // sort and extract data to display
    const values = this.getData(dataset, dataSort);


    const ctx = this.refs.canvas.getContext('2d');

    // Scaling for retina
    let sizeScale = 1.0;
    if (window.devicePixelRatio) {
      sizeScale = window.devicePixelRatio;
    }
    // Reset transform to ensure scale setting is appropriate.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(sizeScale, sizeScale);


    // scales recomputed each draw
    const xScale = d3.scale.linear()
      .range([0, width])
      .clamp(true);

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
      const xValue = value.disabled ? 2 : xScale(value.value);
      ctx.fillRect(0, yScale(value.id), xValue, yScale.rangeBand());
    });

    // draw highlight
    // TODO: this could be an array of highlighted values?
    if(highlightId) {
      ctx.fillStyle = highlightColor;

      const activeValue = values.filter((v) => v.id === highlightId);
      activeValue.forEach(function(value) {
        const xValue = value.disabled ? 4 : xScale(value.value);
        ctx.fillRect(0, yScale(value.id), xValue, yScale.rangeBand());
      });
    }
    if (toggledId) {
      ctx.fillStyle = toggledColor;

      const activeValue = values.filter((v) => v.id === toggledId);
      activeValue.forEach(function(value) {
        const xValue = value.disabled ? 4 : xScale(value.value);
        ctx.fillRect(0, yScale(value.id), xValue, yScale.rangeBand());
      });
    }
  }

  /**
   * Render the chart
   */
  render() {
    const { dataset, width, height, isActive } = this.props;

    // scaling for retina
    let sizeScale = 1.0;
    if (window.devicePixelRatio) {
      sizeScale = window.devicePixelRatio;
    }

    let canvasStyle = {
      width: width,
      height: height
    };

    const classes = classNames({
      'SmallWaterfallPlot':true,
      'active':isActive
    });

    return (
      <div className={classes}  onClick={this.handleClick}>
        <div className='name'>{dataset.label}</div>
        <canvas className='chart' ref="canvas" style={canvasStyle} id={dataset.id} width={width * sizeScale} height={height * sizeScale} />
      </div>
    );
  }
}

SmallWaterfallPlot.defaultProps = defaultProps;
SmallWaterfallPlot.propTypes = propTypes;

export default SmallWaterfallPlot;
