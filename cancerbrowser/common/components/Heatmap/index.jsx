import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import d3 from 'd3';

import './heatmap.scss';


const propTypes = {
  /* [{id:string, label:string, measurements:[id, value, label]}] */
  dataset: React.PropTypes.array,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  margins: React.PropTypes.object,
  dataExtent: React.PropTypes.array
};


const defaultProps = {
  width: 900,
  height: 1200,
  margins: {top:40, left:20, right:5, bottom:20},
  dataExtent: [-2.9, 2.9]
};

/**
 * Heatmap component. Uses canvas to display Heatmap
 * Use SVG for labels.
 */
class Heatmap extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Lifecycle method to determine update
   */
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  /**
   * Update canvas when component mounts
   */
  componentDidMount() {
    this.updateVisuals();
  }

  /**
   * Update Canvas when component updates
   */
  componentDidUpdate() {
    this.updateVisuals();
  }

  /**
   * Update scales
   */
  updateScales(data, width, height, props) {
    // const minVal = d3.min(data, (d) => d.extent[0]);
    // const maxVal = d3.max(data, (d) => d.extent[1]);

    const { dataExtent } = props;

    const rowIds = data.map((d) => d.id);
    const colIds = data[0].measurements.map((m) => m.id);

    const yScale = d3.scale.ordinal()
      .domain(rowIds)
      .rangeBands([0, height]);

    const xScale = d3.scale.ordinal()
      .domain(colIds)
      .rangeRoundBands([0, width]);

    const colorScale = d3.scale.linear()
      .domain(dataExtent)
      .range(['white', '#FA6900']);

    return {x:xScale, y:yScale, color:colorScale};
  }


  /**
   * Rerenders the chart on the canvas. Recomputes data sorting and scales.
   */
  updateVisuals() {
    const { dataset, width, height, margins } = this.props;

    const mWidth = width - (margins.left + margins.right);
    const mHeight = height - (margins.top + margins.bottom);

    const scales = this.updateScales(dataset, mWidth, mHeight, this.props);


    const ctx = this.refs.canvas.getContext('2d');

    // Scaling for retina
    let sizeScale = 1.0;
    if (window.devicePixelRatio) {
      sizeScale = window.devicePixelRatio;
    }
    // Reset transform to ensure scale setting is appropriate.
    ctx.setTransform(1, 0, 0, 1, (margins.left * sizeScale), (margins.top * sizeScale));
    ctx.scale(sizeScale, sizeScale);


    ctx.clearRect(0,0, width, height);

    const rowLength = dataset.length;
    for(let i = 0; i < rowLength; i++ ) {
      const rowData = dataset[i];
      const colLength = rowData.measurements.length;

      for(let j = 0; j < colLength; j++) {
        const colData = rowData.measurements[j];

        ctx.fillStyle = scales.color(colData.value);


        const y = scales.y(rowData.id);
        const x = scales.x(colData.id);
        const rwidth = scales.x.rangeBand();
        const rheight = scales.y.rangeBand();

        ctx.fillRect(x, y, rwidth, rheight);

      }
    }

    // SVG Stuff
    const svg = d3.select(this.refs.svg);
    const g = svg.select('g');
    const mData = dataset[0].measurements;

    const labels = g.selectAll('.label')
      .data(mData, (d) => d.id);

    labels.exit().remove();

    labels.enter()
      .append('text')
      .classed('label', true)
      .attr('text-anchor', 'middle');

    labels.attr('x', (d) => scales.x(d.id) + scales.x.rangeBand() / 2)
      .attr('y', 14)
      .text((d) => d.label);

  }

  /**
   * Main render method
   */
  render() {
    const { width, height, margins } = this.props;

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
      <div className="Heatmap">
        <canvas className='heatmap-canvas' ref='canvas' style={canvasStyle} width={width * sizeScale} height={height * sizeScale} />
        <svg className='heatmap-svg' ref='svg' width={width} height={height}>
          <g transform={`translate(${margins.left},${0})`}></g>
        </svg>
      </div>
    );
  }
}

Heatmap.propTypes = propTypes;
Heatmap.defaultProps = defaultProps;

export default Heatmap;
