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

  /* function mapping data items to colors */
  colorScale: React.PropTypes.func,

  /* function that formats values e.g. d3.format('0.2f') */
  valueFormatter: React.PropTypes.func
};

const defaultProps = {
  width: 500,
  height: 200,
  valueFormatter: d3.format('0.2f')
};


class ParallelCoordinatesPlot extends React.Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.onDeselect = this.onDeselect.bind(this);
  }

  /**
   *
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
    this.chart.on('highlight', this.onSelect);
    this.chart.on('unhighlight', this.onDeselect);
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
  onSelect(d) {
    const { onChangeHighlight } = this.props;

    if (onChangeHighlight) {
      onChangeHighlight(d.id);
    }
  }

  /**
   * Handler for deselecting a highlighted line
   */
  onDeselect() {
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
