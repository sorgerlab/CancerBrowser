

import d3 from 'd3';

const DISABLED_BAR_SIZE = 5;
const MINIMUM_BAR_SIZE = 1;

class Waterfall {
  /**
   * Constructor. Sets up container location and scales for visual.
   *
   * @param {Object} container Container DOM element.
   */
  constructor(container) {
    this.svg = d3.select(container)
     .append('svg')
     .classed('waterfall', true);

    this.g = this.svg.append('g');
    this.xAxisGroup = this.g.append('g')
      .attr('transform', 'translate(0,0)')
      .attr('class', 'x axis');


    this.dispatch = d3.dispatch('highlight', 'unhighlight', 'toggle',
      'untoggle', 'labelClick');

    // window.addEventListener('resize', this.handleResize.bind(this));

    this.margins = {
      left: 5,
      right: 40,
      top: 25,
      bottom: 10
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onLabelClick = this.onLabelClick.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onUntoggle = this.onUntoggle.bind(this);
  }

  /**
   *
   */
  updateScales(data, props) {
    const { dataExtent, colorScale } = props;

    let xMin = 0, xMax = this.width;
    // add some space for infinity triangles if needed
    if (data.some(d => d.value === Number.NEGATIVE_INFINITY)) {
      xMin += 10;
    }
    if (data.some(d => d.value === Number.POSITIVE_INFINITY)) {
      xMax -= 10;
    }

    // scales recomputed each draw
    const xScale = d3.scale.linear()
      .range([xMin, this.width])
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

  // makes helper functions for getting the left edge, right edge and width of a rect
  // based on a property key
  getRectFunctions(centerValue, xScale, key = 'value') {
    let leftEdge = () => 0;
    let rightEdge = (d) => d.disabled ? DISABLED_BAR_SIZE : xScale(d[key]);

    if (centerValue != null) {
      leftEdge = d => {
        const value = d.disabled ? centerValue : d[key];
        if (value < centerValue) {
          return xScale(value);
        } else {
          return xScale(centerValue);
        }
      };

      rightEdge = d => {
        const value = d.disabled ? centerValue : d[key];
        if (value > centerValue) {
          return xScale(value);
        } else {
          return xScale(centerValue);
        }
      };
    }

    const barWidth = d => Math.max(rightEdge(d) - leftEdge(d), MINIMUM_BAR_SIZE);

    return { leftEdge, rightEdge, barWidth };
  }

  // function to generate bar path that handles infinity
  makeBar(d, leftEdge, rightEdge, barHeight, triangleWidth) {
    const left = leftEdge(d);
    const right = rightEdge(d);
    const height = barHeight;
    const triangleMid = height / 2;

    if (d.value === Number.POSITIVE_INFINITY) {
      const triangleStart = right;
      const trianglePoint = right + triangleWidth;
      return `M ${left} 0
        H ${triangleStart}
        L ${trianglePoint} ${triangleMid}
        L ${triangleStart} ${height}
        H ${left}
        Z`;
    }  else if (d.value === Number.NEGATIVE_INFINITY) {
      const triangleStart = left;
      const trianglePoint = left - triangleWidth;
      return `M ${right} 0
        H ${triangleStart}
        L ${trianglePoint} ${triangleMid}
        L ${triangleStart} ${height}
        H ${right}
        Z`;
    }

    return `M ${left} 0 H ${right} V ${height} H ${left} Z`;
  }

  /**
   *
   */
  update(props, state) {
    const { width, height, labelLocation, highlightId, useThresholds,
      valueFormatter, onLabelClick, centerValue, toggledId, itemAxisLabel,
      valueAxisLabel } = props;

    const { sortedData } = state;

    // Early out
    if(!sortedData) {
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

    if (valueAxisLabel) {
      this.margins.top = 40;
    }

    this.width = width - (this.margins.left + this.margins.right);

    let outerHeight = height;
    if (outerHeight == null) {
      // base the height on the size of the bars instead of a predetermined value
      const barHeight = 22;
      this.height = barHeight * sortedData.length;
    } else {
      this.height = outerHeight - (this.margins.top + this.margins.bottom);
    }


    this.svg
      .attr('width', this.width + (this.margins.left + this.margins.right))
      .attr('height', this.height + (this.margins.top + this.margins.bottom));

    this.g
      .attr('transform', `translate(${this.margins.left},${this.margins.top})`);



    const data = sortedData;

    const scales = this.updateScales(data, props);

    // add in value axis label if provided
    this.g.select('.value-axis-label').remove();
    if (valueAxisLabel) {
      this.g.append('text')
        .classed('value-axis-label', true)
        .attr('x', scales.x.range()[1])
        .attr('text-anchor', 'end')
        .attr('y', -20)
        .text(valueAxisLabel);
    }

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


    // add in item axis label
    this.g.select('.item-axis-label').remove();
    if (itemAxisLabel) {
      this.g.append('text')
        .classed('item-axis-label', true)
        .attr('x', labelLocation === 'right' ? this.width : 0)
        .attr('dx', labelLocation === 'right' ? 8 : -8)
        .attr('text-anchor', labelLocation === 'right' ? 'start' : 'end')
        .attr('y', scales.y.range()[0])
        .attr('dy', -6)
        .text(itemAxisLabel);
    }

    const labels = this.g
      .selectAll('.label-group')
      .data(data, (d) => d.id);

    labels.exit().remove();

    if(labelLocation)  {
      const transformLabel = d => {
        let x;
        if (labelLocation === 'right') {
          x = this.width;
        } else {
          // make room for the label click icon if it is there
          x = (onLabelClick && toggledId === d.id) ? -15 : 0;
        }

        const y = scales.y(d.id);

        return `translate(${x} ${y})`;
      };

      const labelsEnter = labels.enter()
        .append('g')
        .classed('label-group', true)
        .classed('toggled', (d) => d.id === toggledId)
        .attr('transform', transformLabel);

      // if a label click handler is provided, add in the label click icon
      if (onLabelClick) {
        labelsEnter
          .append('text')
          .on('click', this.onLabelClick)
          .classed('label-click-control', true)
          .attr('text-anchor', 'end')
          .attr('dx', -8)
          .attr('dy', (scales.y.rangeBand() / 2) + 5)
          .text('');
      }

      // add main label text to the group
      labelsEnter
        .append('text')
        .classed('label', true)
        .classed('clickable', true)
        .on('mouseenter', this.onMouseEnter)
        .on('mouseleave', this.onMouseLeave)
        .attr('dx', labelLocation === 'right' ? 8 : -8)
        .attr('dy', (scales.y.rangeBand() / 2) + 5);


      // update the groups
      labels
        .classed('toggled', (d) => d.id === toggledId)
        .transition()
        .duration(transitionDuration)
        .delay(transitionDelay)
        .attr('transform', transformLabel);

      // update main label text
      labels.select('.label')
        .on('click', d => d.id === toggledId ? this.onUntoggle(d) : this.onToggle(d))
        .classed('highlight', (d) => d.id === highlightId)
        .classed('toggled', (d) => d.id === toggledId)
        .classed('disabled', (d) => d.disabled)
        .text((d) => d.label)
        .attr('text-anchor', labelLocation === 'right' ? 'start' : 'end')
        .attr('dx', labelLocation === 'right' ? 8 : -8)
        .attr('dy', (scales.y.rangeBand() / 2) + 5);

      // if a label click handler is provided, update the revealed icon
      if (onLabelClick) {
        labels.select('.label-click-control')
          .classed('clickable', d => d.id === toggledId)
          .attr('dx', 8)
          .attr('dy', (scales.y.rangeBand() / 2) + 5);
      }
    }

    // minus 2 to make room for the stroke
    const barHeight = scales.y.rangeBand() - 2;
    const infinityTriangleWidth = 10;

    const bars = this.g
      .selectAll('.bar-container')
      .data(data, (d) => d.id);

    bars.exit().remove();

    const barsEnter = bars.enter()
      .append('g')
      .classed('bar-container', true)
      .classed('clickable', true)
      .attr('transform', d => `translate(0 ${scales.y(d.id)})`);

    const { leftEdge, rightEdge } = this.getRectFunctions(centerValue, scales.x, 'value');
    const { leftEdge: leftEdgeThreshold, barWidth: barWidthThreshold } =
      this.getRectFunctions(centerValue, scales.x, 'threshold');

    // add in value bars
    barsEnter
      .append('path')
      .classed('bar', true)
      .style('fill', d => scales.color(d))
      .attr('d', d => this.makeBar(d, leftEdge, rightEdge, barHeight, infinityTriangleWidth));

    // add in threshold bars -- always add them even if not using
    // thresholds in case we change to using thresholds later (in
    // which case, .enter() wouldn't have these bars since the data
    // is applied to the bar group.
    barsEnter
      .append('rect')
      .classed('threshold', true)
      .style('opacity', useThresholds ? 1 : 0)
      .attr('height', barHeight)
      .attr('x', leftEdgeThreshold)
      .attr('width', useThresholds ? barWidthThreshold : 1e-6);

    // add in values but only draw on highlight/toggle
    barsEnter
      .append('text')
      .classed('bar-value', true)
      .attr('text-anchor', 'start')
      .attr('x', rightEdge)
      .attr('dx', d => d.value === Number.POSITIVE_INFINITY ? infinityTriangleWidth + 5 : 5)
      .attr('dy', barHeight - 4);

    // UPDATE bars
    bars
      .transition()
      .duration(transitionDuration)
      .delay(transitionDelay)
      .attr('transform', d => `translate(0 ${scales.y(d.id)})`);

    bars.select('.bar')
      .classed('highlight', (d) => d.id === highlightId)
      .classed('toggled', (d) => d.id === toggledId)
      .style('fill', (d) => scales.color(d))
      .transition()
      .duration(transitionDuration)
      .delay(transitionDelay)
      .attr('d', d => this.makeBar(d, leftEdge, rightEdge, barHeight, infinityTriangleWidth));

    // bar values (text)
    bars.select('.bar-value')
      .style('opacity', d => (d.id === highlightId || d.id === toggledId) ? 1 : 0)
      .text(d => {
        // for disabled values show n/a
        if (d.disabled) {
          return 'N/A';
        }

        // for infinity, show the infinity symbol instead of the word
        if (d.value === Number.POSITIVE_INFINITY) {
          return '∞';
        } else if (d.value === Number.NEGATIVE_INFINITY) {
          return '-∞';
        }

        return valueFormatter ? valueFormatter(d.value) : d.value;
      })
      .transition()
      .duration(transitionDuration)
      .delay(transitionDelay)
      .attr('x', rightEdge);



    if (useThresholds) {
      bars.select('.threshold')
        .classed('highlight', (d) => d.id === highlightId)
        .classed('toggled', (d) => d.id === toggledId)
        .transition()
        .duration(transitionDuration)
        .delay(transitionDelay)
        .style('opacity', 1)
        .attr('x', leftEdgeThreshold)
        .attr('width', useThresholds ? barWidthThreshold : 1e-6);

    } else {
      // in case we turned off useThresholds
      bars.select('.threshold')
        .transition()
        .duration(transitionDuration)
        .delay(transitionDelay)
        .style('opacity', 0)
        .attr('x', 0)
        .attr('width', 1e-6);
    }

    // for easier handling across a bar's row
    const mouseHandlerBars = this.g
      .selectAll('.mouse-handler-bar')
      .data(data, (d) => d.id);

    mouseHandlerBars.exit().remove();

    mouseHandlerBars.enter()
      .append('rect')
      .classed('mouse-handler-bar', true);

    mouseHandlerBars
      .attr('x', 0)
      .attr('y', (d) => scales.y(d.id))
      .attr('width', this.width)
      .attr('height', scales.y.rangeBand() + 1)
      .style('fill', '#fff')
      .on('mouseenter', this.onMouseEnter)
      .on('mouseleave', this.onMouseLeave)
      .on('click', d => d.id === toggledId ? this.onUntoggle(d) : this.onToggle(d));
  }

  onMouseEnter(d) {
    this.dispatch.highlight(d);
  }

  onMouseLeave(d) {
    this.dispatch.unhighlight(d);
  }

  onLabelClick(d) {
    this.dispatch.labelClick(d);
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


export default Waterfall;
