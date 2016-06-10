import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import { powerSampler } from './samplers';
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

  /* function to use to sample the data. Takes form function(options:Object, datum:Object, func:Function) */
  sampler: React.PropTypes.func,

  /* object specifying options (first arg) to sampler */
  samplerOptions: React.PropTypes.object,

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
  labelKey: React.PropTypes.string
};

const defaultProps = {
  width: 500,
  height: 200,
  colorScale: () => '#bbb',
  identifier: 'id',
  labelKey: 'label',
  sampler: powerSampler,
  samplerOptions: { exponent: 10, numSamples: 50 }
};

/**
 * Component to plot a given function
 * using lines.
 */
class FunctionPlot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sampledData: this.sampleData(props)
    };

    this.sampleData = this.sampleData.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onUntoggle = this.onUntoggle.bind(this);
    this.onHighlight = this.onHighlight.bind(this);
    this.onUnhighlight = this.onUnhighlight.bind(this);
  }

  // precompute the sampled data
  sampleData(props = this.props) {
    const { dataset, func, sampler, samplerOptions, xExtent } = props;

    if (!dataset) {
      return undefined;
    }

    let options = Object.assign({}, samplerOptions);
    // use the x-extent as a default sample range
    if (!options.sampleRange) {
      options.sampleRange = xExtent;
    }

    return dataset.map(datum => ({
      datum: datum,
      samples: this.sampleDatum(options, datum, func, sampler)
    }));
  }

  /**
   * Produces [{x, y}, ...] from a function and sampler
   * @param {Object} options The options to pass to the sampler
   * @param {Object} datum The series data
   * @param {Function} func The function to sample
   * @param {Function} sampler Function that produces an array of x values to sample at
   * @return {Array} Array of {x, y} points
   */
  sampleDatum(options, datum, func, sampler) {
    return sampler(options, datum, func).map(x => ({ x, y: func(datum, x) }));
  }

  // only re-sample data when new data/sampler/function received
  componentWillReceiveProps(nextProps) {
    if (nextProps.dataset !== this.props.dataset ||
        nextProps.sampler !== this.props.sampler ||
        nextProps.func !== this.props.func) {
      this.setState({
        sampledData: this.sampleData(nextProps)
      });
    }
  }


  /**
   * Life cycle method to check if component needs to be updated
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

    this.chart.update(this.props, this.state);
    this.chart.on('highlight', this.onHighlight);
    this.chart.on('unhighlight', this.onUnhighlight);
    this.chart.on('toggle', this.onToggle);
    this.chart.on('untoggle', this.onUntoggle);
  }

  /**
   * When props update, update the d3 component
   */
  componentDidUpdate() {
    this.chart.update(this.props, this.state);
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
