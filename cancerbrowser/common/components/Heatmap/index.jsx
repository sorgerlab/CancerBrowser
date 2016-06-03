import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import d3 from 'd3';

import './heatmap.scss';


const propTypes = {
  /* [{id:string, label:string, measurements:[id, value, label]}] */
  dataset: React.PropTypes.array,
  width: React.PropTypes.number,
  height: React.PropTypes.number
};


const defaultProps = {
  width: 900,
  height: 1200
};


class Heatmap extends React.Component {
  constructor(props) {
    super(props);
  }

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

  updateScales(data, width, height, margins) {

    const rowIds = data.map((d) => d.id);
    const colIds = data[0].measurements.map((m) => m.id);

    console.log(colIds)

    const yScale = d3.scale.ordinal()
      .domain(rowIds)
      .rangeBands([0, height]);

    const xScale = d3.scale.ordinal()
      .domain(colIds)
      .rangeRoundBands([0, width]);

    const colorScale = d3.scale.linear()
      .domain([-5, 5])
      .range(['yellow', 'red']);

    return {x:xScale, y:yScale, color:colorScale};
  }


  /**
   * Rerenders the chart on the canvas. Recomputes data sorting and scales.
   */
  updateCanvas() {
    const { dataset, width, height } = this.props;
    console.log(dataset)

    const scales = this.updateScales(dataset, width, height);


    const ctx = this.refs.canvas.getContext('2d');

    // Scaling for retina
    let sizeScale = 1.0;
    if (window.devicePixelRatio) {
      sizeScale = window.devicePixelRatio;
    }
    // Reset transform to ensure scale setting is appropriate.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(sizeScale, sizeScale);


    ctx.clearRect(0,0, width, height);

    let temp = []


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

        temp.push({y:y,x:x,w:rwidth,h:rheight});


        ctx.fillRect(x, y, rwidth, rheight);

      }
    }

    console.log(temp)

    // draw highlight
    // TODO: this could be an array of highlighted values?
    // if(highlightId) {
    //
    //   ctx.fillStyle = highlightColor;
    //
    //   const activeValue = values.filter((v) => v.id === highlightId);
    //   activeValue.forEach(function(value) {
    //     const xValue = value.disabled ? 4 : xScale(value.value);
    //     ctx.fillRect(0, yScale(value.id), xValue, yScale.rangeBand());
    //   });
    // }
  }



  render() {
    const { width, height } = this.props;

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
        <canvas className='heatmapCanvas' ref="canvas" style={canvasStyle} width={width * sizeScale} height={height * sizeScale} />
      </div>
    );
  }
}

Heatmap.propTypes = propTypes;
Heatmap.defaultProps = defaultProps;

export default Heatmap;
