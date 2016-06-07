

import d3 from 'd3';

const DISABLED_BAR_SIZE = 5;
const MINIMUM_BAR_SIZE = 1;

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

  /**
   *
   */
  update(props) {
    const {dataset, width, height, dataSort, labelLocation,
      highlightId, useThresholds, valueFormatter, onLabelClick,
      centerValue, toggledId, itemAxisLabel, valueAxisLabel } = props;

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

    if (valueAxisLabel) {
      this.margins.top = 40;
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
      .selectAll('.label')
      .data(data, (d) => d.id);

    labels.exit().remove();

    if(labelLocation)  {
      labels.enter()
        .append('text')
        .classed('label', true)
        .classed('clickable', true)
        .on('mouseenter', this.onMouseEnter)
        .on('mouseleave', this.onMouseLeave)
        .attr('x', labelLocation === 'right' ? this.width : 0)
        .attr('dx', labelLocation === 'right' ? 8 : -8)
        .attr('y', (d) => scales.y(d.id))
        .attr('dy', (scales.y.rangeBand() / 2) + 5);

      labels
        .on('click', d => d.id === toggledId ? this.onUntoggle(d) : this.onToggle(d))
        .classed('highlight', (d)  => d.id === highlightId)
        .classed('toggled', (d)  => d.id === toggledId)
        .classed('disabled', (d)  => d.disabled)
        .text((d) => d.label)
        .attr('text-anchor', labelLocation === 'right' ? 'start' : 'end')
        .transition()
        .duration(transitionDuration)
        .delay(transitionDelay)
        .attr('x', labelLocation === 'right' ? this.width : 0)
        .attr('dx', labelLocation === 'right' ? 8 : -8)
        .attr('y', (d) => scales.y(d.id))
        .attr('dy', (scales.y.rangeBand() / 2) + 5);

      // if a label click handler is provided, add in the label click icon
      this.g.selectAll('.label-click-control').remove();
      if (onLabelClick && toggledId) {
        const toggledDatum = data.find(d => d.id === toggledId);

        if (toggledDatum) {
          this.g
            .append('text')
            .on('click', this.onLabelClick.bind(this, toggledDatum))
            .classed('label-click-control', true)
            .attr('x', -this.margins.left)
            .attr('dx', 4)
            .attr('y', scales.y(toggledDatum.id))
            .attr('dy', (scales.y.rangeBand() / 2) + 5)
            .text('');
        }
      }
    }

    // minus 2 to make room for the stroke
    const barHeight = scales.y.rangeBand() - 2;

    const bars = this.g
      .selectAll('.bar-container')
      .data(data, (d) => d.id);

    bars.exit().remove();

    const barsEnter = bars.enter()
      .append('g')
      .classed('bar-container', true)
      .classed('clickable', true)
      .attr('transform', d => `translate(0 ${scales.y(d.id)})`);

    const { leftEdge, rightEdge, barWidth } = this.getRectFunctions(centerValue, scales.x, 'value');
    const { leftEdge: leftEdgeThreshold, barWidth: barWidthThreshold } =
      this.getRectFunctions(centerValue, scales.x, 'threshold');

    // add in value bars
    barsEnter
      .append('rect')
        .classed('bar', true)
        .style('fill', (d) => scales.color(d))
        .attr('height', barHeight)
        .attr('x', leftEdge)
        .attr('width', barWidth);

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
      .attr('dx', 5)
      .attr('dy', barHeight - 4);

    // UPDATE bars
    bars
      .transition()
      .duration(transitionDuration)
      .delay(transitionDelay)
      .attr('transform', d => `translate(0 ${scales.y(d.id)})`);

    bars.select('.bar')
      .classed('highlight', (d) => d.id === highlightId)
      .classed('toggled', (d)  => d.id === toggledId)
      .attr('height', barHeight)
      .style('fill', (d) => scales.color(d))
      .transition()
      .duration(transitionDuration)
      .delay(transitionDelay)
      .attr('x', leftEdge)
      .attr('width', barWidth);

    // bar values (text)
    bars.select('.bar-value')
      .style('opacity', d => (d.id === highlightId || d.id === toggledId) ? 1 : 0)
      .text(d => valueFormatter ? valueFormatter(d.value) : d.value)
      .transition()
      .duration(transitionDuration)
      .delay(transitionDelay)
      .attr('x', rightEdge);



    if (useThresholds) {
      bars.select('.threshold')
        .classed('highlight', (d)  => d.id === highlightId)
        .classed('toggled', (d)  => d.id === toggledId)
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
      .attr('height', barHeight)
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
