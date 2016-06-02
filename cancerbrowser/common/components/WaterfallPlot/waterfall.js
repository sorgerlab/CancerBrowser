

import d3 from 'd3';


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

    this.xAxisGroup = this.svg.append('g')
      .attr('transform', 'translate(0,30)')
      .attr('class', 'x axis');

    this.g = this.svg.append('g');

    this.dispatch = d3.dispatch('highlight', 'unhighlight');

    // window.addEventListener('resize', this.handleResize.bind(this));


    this.margins = {
      left: 5,
      right: 5,
      top: 15,
      bottom: 10
    };


    this.onMouseover = this.onMouseover.bind(this);
    this.onMouseout = this.onMouseout.bind(this);
  }

  initialRender() {

  }

  /**
   * Extracts data from dataset and
   * sorts data.
   * @param {Object} dataset Measurement dataset
   * @param (Function) sortFunc function indicating how to sort.
   */
  updateData(dataset, sortFunc) {

    const data = dataset.measurements;
    data.sort(sortFunc);

    return data;
  }

  updateScales(data, props) {

    const { dataExtent } = props;
    // scales recomputed each draw
    const xScale = d3.scale.linear()
      .range([this.margins.left, this.width]);

    if(dataExtent) {
      xScale.domain(dataExtent);
    } else {
      xScale.domain(d3.extent(data, (d) => d.value));
    }

    const yScale = d3.scale.ordinal()
      .domain(data.map((v) => v.id))
      .rangeRoundBands([this.margins.top, this.height], 0.05);

    const colorScale = (d) => '#999';

    return {x: xScale, y: yScale, color:  colorScale};
  }

  update(props) {
    const {dataset, width, height, dataSort, labelLocation, highlightId } = props;

    // Early out
    if(!dataset) {
      return;
    }

    // Allow for right or left (or no) placement of labels
    if(labelLocation === 'left') {
      this.margins.left = 80;
      this.margins.right = 5;
    } else if(labelLocation === 'right') {
      this.margins.right = 80;
      this.margins.left = 5;
    } else {
      this.margins.right = 5;
      this.margins.left = 5;
    }

    this.width = width - (this.margins.left + this.margins.right);
    this.height = height - (this.margins.top + this.margins.bottom);

    this.svg
      .attr('width', this.width + (this.margins.left + this.margins.right))
      .attr('height', this.height + (this.margins.top + this.margins.bottom));

    this.g
      .attr('transform', `translate(${this.margins.left},${this.margins.top})`);


    const data = this.updateData(dataset, dataSort);

    const scales = this.updateScales(data, props);


    const xAxis = d3.svg.axis()
      .scale(scales.x)
      .orient('top')
      .tickSize(-height);

    this.xAxisGroup
      .call(xAxis);

    const labels = this.g
      .selectAll('.label')
      .data(data);

    if(labelLocation)  {
      labels.enter()
        .append('text')
        .classed('label', true);

      labels
        .attr('text-anchor', labelLocation === 'right' ? 'start' : 'end')
        .attr('x', labelLocation === 'right' ? this.width : 0)
        .attr('dx', labelLocation === 'right' ? 8 : -8)
        .attr('y', (d) => scales.y(d.id))
        .attr('dy', 12)
        .classed('highlight', (d)  => d.id === highlightId)
        .text((d) => d.label)
        .on('mouseover', this.onMouseover)
        .on('mouseout', this.onMouseout);

    }


    // for easier mouseovering
    const hoverBars = this.g
      .selectAll('.hover')
      .data(data);

    hoverBars.enter()
      .append('rect')
      .classed('hover', true);

    hoverBars
      .attr('x', 0)
      .attr('y', (d) => scales.y(d.id))
      .attr('width', this.width)
      .attr('height', scales.y.rangeBand())
      .style('fill', '#fff')
      .on('mouseover', this.onMouseover)
      .on('mouseout', this.onMouseout);

    const bars = this.g
      .selectAll('.bar')
      .data(data);

    bars.enter()
      .append('rect')
      .classed('bar', true);

    bars
      .attr('x', 0)
      .attr('y', (d) => scales.y(d.id))
      .attr('width', (d) => scales.x(d.value))
      .attr('height', scales.y.rangeBand())
      .style('fill', (d) => scales.color(d.id))
      .classed('highlight', (d)  => d.id === highlightId)
      .on('mouseover', this.onMouseover)
      .on('mouseout', this.onMouseout);

    const showThresholds = true;

    if(showThresholds) {

      const thresholdBars = this.g
        .selectAll('.threshold')
        .data(data);

      thresholdBars.enter()
        .append('rect')
        .classed('threshold', true);

      thresholdBars
        .attr('x', 0)
        .attr('y', (d) => scales.y(d.id))
        .attr('width', (d) => scales.x(d.threshold))
        .attr('height', scales.y.rangeBand())
        .classed('highlight', (d)  => d.id === highlightId)
        .on('mouseover', this.onMouseover)
        .on('mouseout', this.onMouseout);
    }
  }

  onMouseover(d) {
    console.log(d)
    this.dispatch.highlight(d);
  }

  onMouseout(d) {
    this.dispatch.unhighlight(d);
  }

  /**
   * Display list of technologies table using the data passed in via `update`.
   */
  render() {
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
