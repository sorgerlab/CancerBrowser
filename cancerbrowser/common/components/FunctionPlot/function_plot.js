import d3 from 'd3';

/**
 * D3 specific code for the FunctionPlot component
 */
class FunctionPlot {
  /**
   * Constructor. Sets up container location and scales for visual.
   *
   * @param {Object} container Container DOM element.
   */
  constructor(container) {
    this.svg = d3.select(container)
     .append('svg')
     .classed('function-plot', true);

    this.g = this.svg.append('g');

    this.margins = {
      left: 50,
      right: 50,
      top: 25,
      bottom: 40
    };

    this.xAxisGroup = this.g.append('g')
      .attr('transform', 'translate(0,0)')
      .classed('x axis', true);

    this.yAxisGroup = this.g.append('g')
      .attr('transform', 'translate(0,0)')
      .classed('y axis', true);

    this.referenceLinesGroup = this.g.append('g')
      .classed('reference-lines', true);

    this.linesGroup = this.g.append('g')
      .classed('lines-group', true);

    this.highlightGroup = this.g.append('g')
      .classed('highlight-group', true);

    // event dispatcher
    this.dispatch = d3.dispatch('highlight', 'unhighlight', 'toggle', 'untoggle');
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onUntoggle = this.onUntoggle.bind(this);
  }

  /**
   * Update scales
   */
  updateScales(dataset, props) {
    const { colorScale, xExtent, yExtent } = props;

    // scales recomputed each draw
    const xScale = d3.scale.log()
      .domain(xExtent)
      .range([0, this.width]);

    const yScale = d3.scale.linear()
      .domain(yExtent)
      .range([this.height, 0]);

    return { x: xScale, y: yScale, color: colorScale };
  }

  drawValues(datum, labelKey) {
    if (!datum) {
      return;
    }

    this.highlightGroup.append('text')
      .classed('highlighted-label', true)
      .attr('text-anchor', 'middle')
      .attr('x', this.width / 2)
      .attr('y', 0)
      .attr('dy', -8)
      .text(datum[labelKey]);
  }

  /**
   * callback to update
   */
  update(props, state) {
    const { width, height, highlightId, toggledId,
      valueFormatter, yAxisLabel, xAxisLabel, func, identifier,
      labelKey } = props;

    const { sampledData } = state;

    // Early out
    if(!sampledData) {
      return;
    }

    if (yAxisLabel) {
      this.margins.left = 60;
    }

    this.width = width - (this.margins.left + this.margins.right);
    this.height = height - (this.margins.top + this.margins.bottom);

    this.svg
      .attr('width', this.width + (this.margins.left + this.margins.right))
      .attr('height', this.height + (this.margins.top + this.margins.bottom))
      .classed('many-lines', sampledData.length > 10);

    this.g
      .attr('transform', `translate(${this.margins.left},${this.margins.top})`);

    this.xAxisGroup
      .attr('transform', `translate(0 ${this.height + 5})`);

    const transitionDuration = 300;

    const scales = this.updateScales(sampledData, props);
    const line = d3.svg.line()
      .x(d => scales.x(d.x))
      .y(d => scales.y(d.y))
      .interpolate('monotone');

    const xAxis = d3.svg.axis()
      .scale(scales.x)
      .orient('bottom')
      .ticks(4)
      .tickSize(-5);

    this.xAxisGroup
      .call(xAxis);

    // add in x axis label if provided
    this.g.select('.x-axis-label').remove();
    if (xAxisLabel) {
      this.g.append('text')
        .classed('x-axis-label axis-label', true)
        .attr('text-anchor', 'middle')
        .attr('x', this.width / 2)
        .attr('y', this.height)
        .attr('dy', 40)
        .text(xAxisLabel);
    }

    const yAxis = d3.svg.axis()
      .scale(scales.y)
      .orient('left')
      .ticks(8);

    this.yAxisGroup
      .call(yAxis);

    // add in y axis label if provided
    this.g.select('.y-axis-label').remove();
    if (yAxisLabel) {
      this.g.append('text')
        .classed('y-axis-label axis-label', true)
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(0 ${this.height / 2}) rotate(-90)`)
        .attr('dy', -40)
        .text(yAxisLabel);
    }

    // add in reference lines at y=0 and x=0 -- could be made optional in the future
    let yReferenceLine = this.referenceLinesGroup.select('.y-reference-line');
    if (yReferenceLine.empty()) {
      yReferenceLine = this.referenceLinesGroup.append('line')
        .classed('y-reference-line', true);
    }
    yReferenceLine
      .attr('x1', scales.x(1))
      .attr('x2', scales.x(1))
      .attr('y1', 0)
      .attr('y2', this.height);

    let xReferenceLine = this.referenceLinesGroup.select('.x-reference-line');
    if (xReferenceLine.empty()) {
      xReferenceLine = this.referenceLinesGroup.append('line')
        .classed('x-reference-line', true);
    }
    xReferenceLine
      .attr('y1', scales.y(0))
      .attr('y2', scales.y(0))
      .attr('x1', 0)
      .attr('x2', this.width);



    // draw the lines
    const lines = this.linesGroup.selectAll('.series')
      .data(sampledData, d => d.datum[identifier]);

    // ENTER lines
    const linesEnter = lines.enter()
      .append('g')
      .classed('series', true);

    // add in the actual line
    linesEnter
      .append('path')
      .classed('series-line', true)
      .attr('d', d => line(d.samples));

    // UPDATE lines
    lines.select('.series-line')
      .classed('highlight', d => d.datum[identifier] === highlightId)
      .classed('toggled', d => d.datum[identifier] === toggledId)
      .style('stroke', d => scales.color ? scales.color(d.datum) : undefined)
      .transition()
      .duration(transitionDuration)
      .attr('d', d => line(d.samples));

    // ensure highlighted and toggled lines are moved to front
    lines.each(function (d) {
      if (d.datum[identifier] === highlightId || d.datum[identifier] === toggledId) {
        this.parentNode.appendChild(this);
      }
    });

    // EXIT lines
    lines.exit().remove();


    // show values on highlighted item
    this.highlightGroup.selectAll('*').remove();
    if (highlightId) {
      const highlightedDatum = sampledData.find(d => d.datum[identifier] === highlightId);
      this.drawValues(highlightedDatum, labelKey);
    } else if (toggledId) {
      const toggledDatum = sampledData.find(d => d.datum[identifier] === toggledId);
      this.drawValues(toggledDatum, labelKey);
    }
  }

  /**
   * Callback for hover in
   */
  onMouseEnter(d) {
    this.dispatch.highlight(d.datum);
  }

  /**
   * Callback for hover out
   */
  onMouseLeave(d) {
    this.dispatch.unhighlight(d.datum);
  }

  /**
   * Callback for click
   */
  onToggle(d) {
    this.dispatch.toggle(d.datum);
  }

  /**
   * Callback for unclick
   */
  onUntoggle(d) {
    this.dispatch.untoggle(d.datum);
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

export default FunctionPlot;
