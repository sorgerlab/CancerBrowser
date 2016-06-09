import d3 from 'd3';
import _ from 'lodash';

class ParallelCoordinates {
  /**
   * Constructor. Sets up container location and scales for visual.
   *
   * @param {Object} container Container DOM element.
   */
  constructor(container) {
    this.svg = d3.select(container)
     .append('svg')
     .classed('parallel-coordinates', true);

    this.g = this.svg.append('g');

    this.margins = {
      left: 50,
      right: 50,
      top: 25,
      bottom: 20
    };

    this.xAxisGroup = this.g.append('g')
      .attr('transform', 'translate(0,-10)')
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
   *
   */
  updateScales(dataset, props) {
    const { dataExtent, colorScale } = props;

    // scales recomputed each draw
    const xScale = d3.scale.ordinal()
      .domain(d3.range(props.pointLabels.length))
      .rangePoints([0, this.width]);


    const yScale = d3.scale.linear()
      .range([this.height, 0]);

    if(dataExtent) {
      yScale.domain(dataExtent);
    } else {
      yScale.domain(d3.extent(_.flatten(dataset.map(d => d.values))));
    }

    return { x: xScale, y: yScale, color: colorScale };
  }

  /**
   *
   */
  update(props) {
    const { dataset, pointLabels, width, height, highlightId,
      toggledId, valueFormatter, yAxisLabel } = props;

    // Early out
    if(!dataset) {
      return;
    }

    if (yAxisLabel) {
      this.margins.left = 60;
    }

    this.width = width - (this.margins.left + this.margins.right);
    this.height = height - (this.margins.top + this.margins.bottom);

    this.svg
      .attr('width', this.width + (this.margins.left + this.margins.right))
      .attr('height', this.height + (this.margins.top + this.margins.bottom));

    this.g
      .attr('transform', `translate(${this.margins.left},${this.margins.top})`);

    const transitionDuration = 300;

    const scales = this.updateScales(dataset, props);
    const line = d3.svg.line()
      .x((d, i) => scales.x(i))
      .y(d => scales.y(d));

    const xAxis = d3.svg.axis()
      .scale(scales.x)
      .orient('top')
      .tickFormat(d => pointLabels[d])
      .tickSize(-20);

    this.xAxisGroup
      .call(xAxis);

    const yAxis = d3.svg.axis()
      .scale(scales.y)
      .orient('left')
      .ticks(8);

    this.yAxisGroup
      .call(yAxis);

    // add in value axis label if provided
    this.g.select('.y-axis-label').remove();
    if (yAxisLabel) {
      this.g.append('text')
        .classed('y-axis-label', true)
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(0 ${this.height / 2}) rotate(-90)`)
        .attr('dy', -40)
        .text(yAxisLabel);
    }

    // draw additional axis lines
    const refLines = this.referenceLinesGroup.selectAll('.y-reference-line')
      .data(pointLabels.slice(0));

    refLines.enter()
      .append('line')
      .classed('y-reference-line reference-line', true)
      .attr('y1', 0)
      .attr('y2', this.height);

    refLines
      .attr('x1', (d, i) => scales.x(i))
      .attr('x2', (d, i) => scales.x(i));

    // draw the lines
    const lines = this.linesGroup.selectAll('.series')
      .data(dataset, d => d.id);

    // ENTER lines
    const linesEnter = lines.enter()
      .append('g')
      .classed('series', true);

    // add in the actual line
    linesEnter
      .append('path')
      .classed('series-line', true)
      .attr('d', d => line(d.values));

    // add in the mouse handler
    linesEnter
      .append('path')
      .on('mouseenter', this.onMouseEnter)
      .on('mouseleave', this.onMouseLeave)
      .on('click', d => d.id === toggledId ? this.onUntoggle(d) : this.onToggle(d))
      .classed('mouse-handler', true)
      .attr('d', d => line(d.values));


    // UPDATE lines
    lines.select('.series-line')
      .classed('highlight', d => d.id === highlightId)
      .classed('toggled', d => d.id === toggledId)
      .style('stroke', d => scales.color ? scales.color(d) : undefined)
      .transition()
      .duration(transitionDuration)
      .attr('d', d => line(d.values));

    lines.select('.mouse-handler')
      .attr('d', d => line(d.values));


    // EXIT lines
    lines.exit().remove();

    // show values on highlighted item
    this.highlightGroup.selectAll('*').remove();
    if (highlightId) {
      const highlightedDatum = dataset.find(d => d.id === highlightId);
      this.drawValues(highlightedDatum, scales, valueFormatter);
    } else if (toggledId) {
      const toggledDatum = dataset.find(d => d.id === toggledId);
      this.drawValues(toggledDatum, scales, valueFormatter);
    }
  }

  drawValues(datum, scales, valueFormatter) {
    if (!datum) {
      return;
    }

    this.highlightGroup.append('text')
      .classed('highlighted-label', true)
      .attr('text-anchor', 'middle')
      .attr('x', this.width / 2)
      .attr('y', this.height)
      .attr('dy', 14)
      .text(datum.label);

    // render the values
    datum.values.forEach((value, i) => {
      let textAnchor;
      if (i === 0) {
        textAnchor = 'start';
      } else if (i === datum.values.length - 1) {
        textAnchor = 'end';
      } else {
        textAnchor = 'middle';
      }

      const valueGroup = this.highlightGroup.append('g')
        .attr('transform', `translate(${scales.x(i)} ${scales.y(value)})`)
        .classed('highlighted-value', true);

      valueGroup.append('text')
        .attr('text-anchor', textAnchor)
        .attr('dy', -5)
        .text(valueFormatter ? valueFormatter(value) : value);
    });
  }

  onMouseEnter(d) {
    this.dispatch.highlight(d);
  }

  onMouseLeave(d) {
    this.dispatch.unhighlight(d);
  }

  onToggle(d) {
    this.dispatch.toggle(d);
  }

  onUntoggle(d) {
    this.dispatch.untoggle(d);
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

export default ParallelCoordinates;
