import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import d3 from 'd3';

import Waterfall from './waterfall';

import { sortByValueAndId } from '../../utils/sort';

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
  centerValue: React.PropTypes.number
};


const defaultProps = {
  width: 400,
  height: null, // null height means set height based on max bar size
  labelLocation: 'left',
  dataSort: sortByValueAndId,
  useThresholds: true,
  colorScale: () => '#aaa',
  valueFormatter: d3.format('.2f')
};


class WaterfallPlot extends React.Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.onDeselect = this.onDeselect.bind(this);
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
    this.chart.on('highlight', this.onSelect);
    this.chart.on('unhighlight', this.onDeselect);
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
  onSelect(d) {
    this.props.onChangeHighlight(d.id);
  }

  /**
   *
   */
  onDeselect() {
    this.props.onChangeHighlight(null);
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

    console.log('this.props', this.props.onLabelClick);

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
