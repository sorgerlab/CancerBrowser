import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import d3 from 'd3';

import ParallelCoordinates from './parallel_coordinates';

import './parallel_coordinates_plot.scss';

const propTypes = {
  /* name to use on top of the plot */
  label: React.PropTypes.string,
  /* dataset should look something like (one object for each line)
    [{id:string, label: 'line 1', values: [10, 15, 20] }, ...]
  */
  dataset: React.PropTypes.array,

  /* array of labels for each point */
  pointLabels: React.PropTypes.array,

  /* width of the plot */
  width: React.PropTypes.number,

  /* height of the plot */
  height: React.PropTypes.number,

  /* callback when highlighting a line */
  onChangeHighlight: React.PropTypes.func,

  /* callback when toggling a line */
  onChangeToggle: React.PropTypes.func,

  /* function mapping data items to colors */
  colorScale: React.PropTypes.func,

  /* function that formats values e.g. d3.format('0.2f') */
  valueFormatter: React.PropTypes.func,

  // label for the y axis
  yAxisLabel: React.PropTypes.string
};

const defaultProps = {
  width: 500,
  height: 200,
  valueFormatter: d3.format('0.2f'),
  colorScale: () => '#bbb'
};


/**
 * Parallel Coordinate component for pakt/perk data.
 */
class ParallelCoordinatesPlot extends React.Component {
  constructor(props) {
    super(props);

    this.onToggle = this.onToggle.bind(this);
    this.onUntoggle = this.onUntoggle.bind(this);
    this.onHighlight = this.onHighlight.bind(this);
    this.onUnhighlight = this.onUnhighlight.bind(this);
  }

  /**
   * Lifecycle method for checking update.
   */
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  /**
   * Lifecycle callback for when the component is mounted.
   * Creates new instance of the associated D3-based table and renders it.
   */
  componentDidMount() {

    this.chart = new ParallelCoordinates(this.refs.plotContainer);

    this.chart.update(this.props);
    this.chart.on('highlight', this.onHighlight);
    this.chart.on('unhighlight', this.onUnhighlight);
    this.chart.on('toggle', this.onToggle);
    this.chart.on('untoggle', this.onUntoggle);
  }

  /**
   * When props update, update the d3 component
   */
  componentDidUpdate() {
    this.chart.update(this.props);
  }

  /**
   * Handler for selecting a highlighted line
   */
  onToggle(d) {
    const { onChangeToggle } = this.props;
    if (onChangeToggle) {
      onChangeToggle(d.id);
    }
  }

  /**
   * Handler for deselecting a highlighted line
   */
  onUntoggle() {
    const { onChangeToggle } = this.props;
    if (onChangeToggle) {
      onChangeToggle(null);
    }
  }

  /**
   * Handler for selecting a highlighted line
   */
  onHighlight(d) {
    const { onChangeHighlight } = this.props;

    if (onChangeHighlight) {
      onChangeHighlight(d.id);
    }
  }

  /**
   * Handler for deselecting a highlighted line
   */
  onUnhighlight() {
    const { onChangeHighlight } = this.props;
    if (onChangeHighlight) {
      onChangeHighlight(null);
    }
  }

  /**
   * Render the d3 component container and a header if provided
   */
  render() {
    const { label } = this.props;

    const titleClasses = classNames({
      'name': true
    });

    return (
      <div ref='plotContainer' className='ParallelCoordinatesPlot'>
        <div className={titleClasses}>{label}</div>
      </div>
    );
  }
}

ParallelCoordinatesPlot.propTypes = propTypes;
ParallelCoordinatesPlot.defaultProps = defaultProps;

export default ParallelCoordinatesPlot;
