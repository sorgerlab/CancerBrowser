import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';

import Waterfall from './waterfall';

import { sortByValueAndId } from '../../utils/sort';

import './waterfall_plot.scss';


const propTypes = {

  /* name to use on top of the waterfall */
  label: React.PropTypes.string,
  /* dataset should look something like:
    [{id:string, value: number, label: string, threshold: number, disable: bool}]
  */
  dataset: React.PropTypes.object,
  /* width of waterfall */
  width: React.PropTypes.number,
  /* height of waterfall */
  height: React.PropTypes.number,
  /* callback function for when bar is highlighted*/
  onChangeHighlight: React.PropTypes.func,
  /* either 'right', 'left', or undefined */
  labelLocation: React.PropTypes.string,
  /* function to sort measurement data */
  dataSort: React.PropTypes.func,
  /* boolean for showing or hiding thresholds */
  useThresholds: React.PropTypes.bool
};


const defaultProps = {
  width: 400,
  height: 800,
  labelLocation: 'left',
  dataSort: sortByValueAndId,
  useThresholds: true
};


class WaterfallPlot extends React.Component {
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

    this.chart = new Waterfall(this.refs.waterfallContainer);

    this.chart.update(this.props);
    this.chart.on('highlight', this.onSelect);
    this.chart.on('unhighlight', this.onDeselect);
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
