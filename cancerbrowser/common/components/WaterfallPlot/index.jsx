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

/**
 * Waterfall Plot component.
 * Here a waterfall plot is defined as a bar chart width
 * a default ordering based on magnitude, so the bars
 * are ordered from greatest amount to least amount.
 */
class WaterfallPlot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortedData: this.sortData(props)
    };

    this.sortData = this.sortData.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onUntoggle = this.onUntoggle.bind(this);
    this.onHighlight = this.onHighlight.bind(this);
    this.onUnhighlight = this.onUnhighlight.bind(this);
    this.onLabelClick = this.onLabelClick.bind(this);
  }

  sortData(props = this.props) {
    return props.dataset.slice(0).sort(props.dataSort);
  }

  /**
   * Lifecycle method to check if component needs to update
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

    this.chart.update(this.props, this.state);
    this.chart.on('highlight', this.onHighlight);
    this.chart.on('unhighlight', this.onUnhighlight);
    this.chart.on('toggle', this.onToggle);
    this.chart.on('untoggle', this.onUntoggle);
    this.chart.on('labelClick', this.onLabelClick);
  }

  componentWillReceiveProps(nextProps) {
    // only sort when necessary (data changes or sort changes)
    if (nextProps.dataSort !== this.props.dataSort ||
        nextProps.dataset !== this.props.dataset) {
      this.setState({
        sortedData: this.sortData(nextProps)
      });
    }
  }

  /**
   * Lifecycle method. update D3 portion of the chart with new props.
   */
  componentDidUpdate() {
    this.chart.update(this.props, this.state);
  }

  /**
   * Callback for highlight event.
   * @param {Object} d Data of object being highlighted.
   */
  onHighlight(d) {
    this.props.onChangeHighlight(d.id);
  }

  /**
   * Callback for unhighlight event.
   */
  onUnhighlight() {
    this.props.onChangeHighlight(null);
  }

  /**
   * Callback for click event.
   * @param {Object} d Data of object being toggled.
   */
  onToggle(d) {
    this.props.onChangeToggle(d.id);
  }

  /**
   * Callback for unclick event.
   */
  onUntoggle() {
    this.props.onChangeToggle(null);
  }

  /**
   * Callback for entity label click
   * @param {Object} d Data of object being clicked.
   */
  onLabelClick(d) {
    const { onLabelClick } = this.props;

    if (onLabelClick) {
      onLabelClick(d);
    }
  }

  /**
   * main render method
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
