import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import d3 from 'd3';

import Waterfall from './waterfall';

import { sortByKeysWithDisabled } from '../../utils/sort';

import './waterfall_plot.scss';


const propTypes = {

  /* name to use on top of the waterfall */
  label: React.PropTypes.string,
  /* dataset should look something like:
    [{id:string, value: number, label: string, threshold: number, disable: bool}]
  */
  dataset: React.PropTypes.array,
  /* width of waterfall */
  width: React.PropTypes.number,
  /* height of waterfall */
  height: React.PropTypes.number,
  /* callback function for when bar is highlighted*/
  onChangeHighlight: React.PropTypes.func,

  /* callback function for when bar is toggled */
  onChangeToggle: React.PropTypes.func,

  /* callback function for when a label is clicked */
  onLabelClick: React.PropTypes.func,

  /* either 'right', 'left', or undefined */
  labelLocation: React.PropTypes.string,
  /* function to sort measurement data */
  dataSort: React.PropTypes.func,
  /* boolean for showing or hiding thresholds */
  useThresholds: React.PropTypes.bool,
  /* if provided, sets the x axis extent*/
  dataExtent: React.PropTypes.array,

  /* function mapping data items to colors */
  colorScale: React.PropTypes.func,

  /* function formatting values on hover */
  valueFormatter: React.PropTypes.func,

  /* if provided, the bars have one edge at this point
   * e.g. if centerValue = 0, negative values extend left from 0
   *                          positive values extend right from 0
   */
  centerValue: React.PropTypes.number,

  /* label for the value axis (x) */
  valueAxisLabel: React.PropTypes.string,

  /* label for the item axis (y) */
  itemAxisLabel: React.PropTypes.string
};


const defaultProps = {
  width: 400,
  height: null, // null height means set height based on max bar size
  labelLocation: 'left',
  dataSort: sortByKeysWithDisabled(['-value', 'label'], ['label']),
  useThresholds: true,
  colorScale: () => '#aaa',
  valueFormatter: d3.format('.2f'),
  onChangeHighlight: () => {},
  onChangeToggle: () => {}
};


class WaterfallPlot extends React.Component {
  constructor(props) {
    super(props);

    this.onToggle = this.onToggle.bind(this);
    this.onUntoggle = this.onUntoggle.bind(this);
    this.onHighlight = this.onHighlight.bind(this);
    this.onUnhighlight = this.onUnhighlight.bind(this);
    this.onLabelClick = this.onLabelClick.bind(this);
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

    this.chart = new Waterfall(this.refs.waterfallContainer);

    this.chart.update(this.props);
    this.chart.on('highlight', this.onHighlight);
    this.chart.on('unhighlight', this.onUnhighlight);
    this.chart.on('toggle', this.onToggle);
    this.chart.on('untoggle', this.onUntoggle);
    this.chart.on('labelClick', this.onLabelClick);
  }

  /**
   *
   */
  componentDidUpdate() {
    this.chart.update(this.props);
  }

  /**
   *
   */
  onHighlight(d) {
    this.props.onChangeHighlight(d.id);
  }

  /**
   *
   */
  onUnhighlight() {
    this.props.onChangeHighlight(null);
  }

  /**
   *
   */
  onToggle(d) {
    this.props.onChangeToggle(d.id);
  }

  /**
   *
   */
  onUntoggle() {
    this.props.onChangeToggle(null);
  }

  onLabelClick(d) {
    const { onLabelClick } = this.props;

    if (onLabelClick) {
      onLabelClick(d);
    }
  }

  /**
   *
   */
  render() {
    const { label, labelLocation } = this.props;

    const titleClasses = classNames({
      'name': true,
      'left': labelLocation === 'left'
    });

    return (
      <div ref='waterfallContainer' className='WaterfallPlot'>
        <div className={titleClasses}>{label}</div>
      </div>
    );
  }
}

WaterfallPlot.propTypes = propTypes;
WaterfallPlot.defaultProps = defaultProps;

export default WaterfallPlot;
