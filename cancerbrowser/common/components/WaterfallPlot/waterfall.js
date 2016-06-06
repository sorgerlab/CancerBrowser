

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


    this.dispatch = d3.dispatch('highlight', 'unhighlight', 'labelClick');

    // window.addEventListener('resize', this.handleResize.bind(this));

    this.margins = {
      left: 5,
      right: 40,
      top: 25,
      bottom: 10
    };

    this.onMouseover = this.onMouseover.bind(this);
    this.onMouseout = this.onMouseout.bind(this);
    this.onLabelClick = this.onLabelClick.bind(this);
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
    const {dataset, width, height, dataSort, labelLocation,
      highlightId, useThresholds, valueFormatter, onLabelClick } = props;

    // Early out
    if(!dataset) {
      return;
    }

    // Allow for right or left (or no) placement of labels
    if(labelLocation === 'left') {
      this.margins.left = 140;
      this.margins.right = 40;
    } else if(labelLocation === 'right') {
      this.margins.right = 140;
      this.margins.left = 5;
    } else {
      this.margins.right = 40;
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

    // animation variables
    const transitionDuration = 300;
    const transitionDelay = (d, i) => i * 5;

    const labels = this.g
      .selectAll('.label')
      .data(data, (d) => d.id);

    labels.exit().remove();

    if(labelLocation)  {
      labels.enter()
        .append('text')
        .classed('label', true)
        .classed('clickable', !!onLabelClick)
        .on('click', this.onLabelClick)
        .on('mouseover', this.onMouseover)
        .on('mouseout', this.onMouseout)
        .attr('x', labelLocation === 'right' ? this.width : 0)
        .attr('dx', labelLocation === 'right' ? 8 : -8)
        .attr('y', (d) => scales.y(d.id))
        .attr('dy', (scales.y.rangeBand() / 2) + 5);

      labels
        .classed('highlight', (d)  => d.id === highlightId)
        .classed('disabled', (d)  => d.disabled)
        .classed('clickable', !!onLabelClick)
        .text((d) => d.label)
        .attr('text-anchor', labelLocation === 'right' ? 'start' : 'end')
        .transition()
        .duration(transitionDuration)
        .delay(transitionDelay)
        .attr('x', labelLocation === 'right' ? this.width : 0)
        .attr('dx', labelLocation === 'right' ? 8 : -8)
        .attr('y', (d) => scales.y(d.id))
        .attr('dy', (scales.y.rangeBand() / 2) + 5);

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
      .selectAll('.bar-container')
      .data(data, (d) => d.id);

    bars.exit().remove();

    const barsEnter = bars.enter()
      .append('g')
      .classed('bar-container', true)
      .attr('transform', d => `translate(0 ${scales.y(d.id)})`);

    // add in value bars
    barsEnter
      .append('rect')
        .classed('bar', true)
        .on('mouseover', this.onMouseover)
        .on('mouseout', this.onMouseout)
        .style('fill', (d) => scales.color(d))
        .attr('height', barHeight)
        .attr('width', (d) => d.disabled ? 0 : scales.x(d.value));

    // add in threshold bars -- always add them even if not using
    // thresholds in case we change to using thresholds later (in
    // which case, .enter() wouldn't have these bars since the data
    // is applied to the bar group.
    barsEnter
      .append('rect')
      .classed('threshold', true)
      .on('mouseover', this.onMouseover)
      .on('mouseout', this.onMouseout)
      .style('opacity', useThresholds ? 1 : 0)
      .attr('height', barHeight)
      .attr('width', (d) => {
        if (useThresholds) {
          return d.disabled ? DISABLED_BAR_SIZE : scales.x(d.threshold);
        } else {
          return 1e-6;
        }
      });

    // UPDATE bars
    bars
      .transition()
      .duration(transitionDuration)
      .delay(transitionDelay)
      .attr('transform', d => `translate(0 ${scales.y(d.id)})`);

    bars.select('.bar')
      .classed('highlight', (d) => d.id === highlightId)
      .attr('height', barHeight)
      .style('fill', (d) => scales.color(d))
      .transition()
      .duration(transitionDuration)
      .delay(transitionDelay)
      .attr('width', (d) => d.disabled ? 0 : scales.x(d.value));

    if (useThresholds) {
      bars.select('.threshold')
        .classed('highlight', (d)  => d.id === highlightId)
        .transition()
        .duration(transitionDuration)
        .delay(transitionDelay)
        .style('opacity', 1)
        .attr('width', (d) => d.disabled ? DISABLED_BAR_SIZE : scales.x(d.threshold));
    } else {
      // in case we turned off useThresholds
      bars.select('.threshold')
        .transition()
        .duration(transitionDuration)
        .delay(transitionDelay)
        .style('opacity', 0)
        .attr('width', 1e-6);
    }

    // add in highlight values
    if (highlightId) {
      const highlightedDatum = dataset.find(d => d.id === highlightId);
      this.g.select('.highlight-value').remove();
      this.g.append('text')
        .classed('highlight-value', true)
        .attr('text-anchor', 'start')
        .attr('x', highlightedDatum.disabled ? DISABLED_BAR_SIZE : scales.x(highlightedDatum.value))
        .attr('dx', 5)
        .attr('y', scales.y(highlightedDatum.id))
        .attr('dy', barHeight - 4)
        .text(valueFormatter ? valueFormatter(highlightedDatum.value) : highlightedDatum.value);
    }
  }

  onMouseover(d) {
    this.dispatch.highlight(d);
  }

  onMouseout(d) {
    this.dispatch.unhighlight(d);
  }

  onLabelClick(d) {
    this.dispatch.labelClick(d);
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
