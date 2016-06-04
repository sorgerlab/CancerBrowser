

import d3 from 'd3';

const DISABLED_BAR_SIZE = 5;

class Waterfall {
  /**
   * Constructor. Sets up container location and scales for visual.
   *
   * @param {Object} container Container DOM element. Expected to be a table.
   */
  constructor(container) {
    this.svg = d3.select(container)
     .append('svg')
     .classed('waterfall', true);

    this.g = this.svg.append('g');
    this.xAxisGroup = this.g.append('g')
      .attr('transform', 'translate(0,0)')
      .attr('class', 'x axis');


    this.dispatch = d3.dispatch('highlight', 'unhighlight');

    // window.addEventListener('resize', this.handleResize.bind(this));

    this.margins = {
      left: 5,
      right: 5,
      top: 25,
      bottom: 10
    };

    this.onMouseover = this.onMouseover.bind(this);
    this.onMouseout = this.onMouseout.bind(this);
  }

  /**
   * Extracts data from dataset and
   * sorts data.
   * @param {Object} dataset Measurement dataset
   * @param (Function) sortFunc function indicating how to sort.
   */
  updateData(dataset, sortFunc) {
    return dataset.sort(sortFunc);
  }

  /**
   *
   */
  updateScales(data, props) {
    const { dataExtent, colorScale } = props;
    // scales recomputed each draw
    const xScale = d3.scale.linear()
      .range([0, this.width])
      .clamp(true);

    if(dataExtent) {
      xScale.domain(dataExtent);
    } else {
      xScale.domain(d3.extent(data, (d) => d.value));
    }

    const yScale = d3.scale.ordinal()
      .domain(data.map((v) => v.id))
      .rangeRoundBands([0, this.height], 0.05);

    return {x: xScale, y: yScale, color: colorScale};
  }

  /**
   *
   */
  update(props) {
    const {dataset, width, height, dataSort, labelLocation, highlightId, useThresholds } = props;

    // Early out
    if(!dataset) {
      return;
    }

    // Allow for right or left (or no) placement of labels
    if(labelLocation === 'left') {
      this.margins.left = 140;
      this.margins.right = 5;
    } else if(labelLocation === 'right') {
      this.margins.right = 140;
      this.margins.left = 5;
    } else {
      this.margins.right = 5;
      this.margins.left = 5;
    }

    this.width = width - (this.margins.left + this.margins.right);

    let outerHeight = height;
    if (outerHeight == null) {
      // base the height on the size of the bars instead of a predetermined value
      const barHeight = 22;
      this.height = barHeight * dataset.length;
    } else {
      this.height = outerHeight - (this.margins.top + this.margins.bottom);
    }


    this.svg
      .attr('width', this.width + (this.margins.left + this.margins.right))
      .attr('height', this.height + (this.margins.top + this.margins.bottom));

    this.g
      .attr('transform', `translate(${this.margins.left},${this.margins.top})`);


    const data = this.updateData(dataset, dataSort);

    const scales = this.updateScales(data, props);

    const xAxis = d3.svg.axis()
      .scale(scales.x)
      .ticks(5)
      .orient('top')
      .tickSize(-20);

    this.xAxisGroup
      .call(xAxis);

    const labels = this.g
      .selectAll('.label')
      .data(data, (d) => d.id);

    labels.exit().remove();

    if(labelLocation)  {
      labels.enter()
        .append('text')
        .classed('label', true);

      labels
        .attr('text-anchor', labelLocation === 'right' ? 'start' : 'end')
        .attr('x', labelLocation === 'right' ? this.width : 0)
        .attr('dx', labelLocation === 'right' ? 8 : -8)
        .attr('y', (d) => scales.y(d.id))
        .attr('dy', (scales.y.rangeBand() / 2) + 5)
        .classed('highlight', (d)  => d.id === highlightId)
        .classed('disabled', (d)  => d.disabled)
        .text((d) => d.label)
        .on('mouseover', this.onMouseover)
        .on('mouseout', this.onMouseout);
    }

    // minus 2 to make room for the stroke
    const barHeight = scales.y.rangeBand() - 2;

    // for easier mouseovering
    const hoverBars = this.g
      .selectAll('.hover')
      .data(data, (d) => d.id);

    hoverBars.exit().remove();

    hoverBars.enter()
      .append('rect')
      .classed('hover', true);

    hoverBars
      .attr('x', 0)
      .attr('y', (d) => scales.y(d.id))
      .attr('width', this.width)
      .attr('height', barHeight)
      .style('fill', '#fff')
      .on('mouseover', this.onMouseover)
      .on('mouseout', this.onMouseout);

    const bars = this.g
      .selectAll('.bar')
      .data(data, (d) => d.id);

    bars.exit().remove();

    bars.enter()
      .append('rect')
      .classed('bar', true);

    bars
      .attr('x', 0)
      .attr('y', (d) => scales.y(d.id))
      .attr('width', (d) => d.disabled ? 0 : scales.x(d.value))
      .attr('height', barHeight)
      .style('fill', (d) => scales.color(d))
      .classed('highlight', (d)  => d.id === highlightId)
      .on('mouseover', this.onMouseover)
      .on('mouseout', this.onMouseout);

    if(useThresholds) {

      const thresholdBars = this.g
        .selectAll('.threshold')
        .data(data, (d) => d.id);

      thresholdBars.exit().remove();

      thresholdBars.enter()
        .append('rect')
        .classed('threshold', true);

      thresholdBars
        .attr('x', 0)
        .attr('y', (d) => scales.y(d.id))
        .attr('width', (d) => d.disabled ? DISABLED_BAR_SIZE : scales.x(d.threshold))
        .attr('height', barHeight)
        .classed('highlight', (d)  => d.id === highlightId)
        .on('mouseover', this.onMouseover)
        .on('mouseout', this.onMouseout);
    }
  }

  onMouseover(d) {
    console.log(d);
    this.dispatch.highlight(d);
  }

  onMouseout(d) {
    this.dispatch.unhighlight(d);
  }

  /**
  * Subscribe to an event from this component
  * @param  {String}   name     Name of event. select|highlight|unhighlight
  * @param  {Function} callback
  */
  on(name, callback) {
    this.dispatch.on(name, callback);
  }

  /**
  * Function to handle resizing on window change
  */
  handleResize() {
    this.updateScales();
    this.render();
  }


}


export default Waterfall;
