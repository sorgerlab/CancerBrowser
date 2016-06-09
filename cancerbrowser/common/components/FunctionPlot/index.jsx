import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';

import FunctionPlotd3 from './function_plot';

import './function_plot.scss';

const propTypes = {
  /* name to use on top of the plot */
  label: React.PropTypes.string,

  /* dataset should look something like (one object for each line)
    [{id:string, label: 'line 1', ... }, ...]
  */
  dataset: React.PropTypes.array,

  /* function to plot. takes arguments (datum, x) */
  func: React.PropTypes.func,

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

  /* label for the y axis */
  yAxisLabel: React.PropTypes.string,

  /* label for the x axis */
  xAxisLabel: React.PropTypes.string,

  /* extent for the y axis and the x axis */
  yExtent: React.PropTypes.array,
  xExtent: React.PropTypes.array,

  /* key in a datum to use as an id (default: 'id') */
  identifier: React.PropTypes.string,

  /* key in a datum to use as an id (default: 'label') */
  label: React.PropTypes.string
};

const defaultProps = {
  width: 500,
  height: 200,
  colorScale: () => '#bbb',
  identifier: 'id',
  labelKey: 'label'
};


class FunctionPlot extends React.Component {
  constructor(props) {
    super(props);

    this.onToggle = this.onToggle.bind(this);
    this.onUntoggle = this.onUntoggle.bind(this);
    this.onHighlight = this.onHighlight.bind(this);
    this.onUnhighlight = this.onUnhighlight.bind(this);
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

    this.chart = new FunctionPlotd3(this.refs.plotContainer);

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
    const { onChangeToggle, identifier } = this.props;
    if (onChangeToggle) {
      onChangeToggle(d[identifier]);
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
    const { onChangeHighlight, identifier } = this.props;

    if (onChangeHighlight) {
      onChangeHighlight(d[identifier]);
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
      <div ref='plotContainer' className='FunctionPlot'>
        <div className={titleClasses}>{label}</div>
      </div>
    );
  }
}

FunctionPlot.propTypes = propTypes;
FunctionPlot.defaultProps = defaultProps;

export default FunctionPlot;
