import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';

import './numbered_select_option.scss';

const propTypes = {
  /* The option to render
      { value: 'big6', label: 'Big 6' }
  */
  option: React.PropTypes.object,

  /*
   * The count to show on the right
   */
  count: React.PropTypes.number,

  /*
   * Number used as maximum count for scaling the bars that go along with counts
   * If not provided, the max of the values provided is used
   */
  countMax: React.PropTypes.number
};


/** A way to render options in react-select that includes a bar and count */
class NumberedSelectOption extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  getBarScale() {
    let { countMax } = this.props;
    const maxBarWidth = 32;
    const barScale = d3.scale.linear().domain([0, countMax]).range([0, maxBarWidth]);
    return barScale;
  }

  renderCount() {
    const { count } = this.props;

    if (count == null) {
      return null;
    }

    const barScale = this.getBarScale();

    return (
      <div className='option-count'>
        <span className='option-count-value'>{count}</span>
        <div className='option-count-bar' style={{ width: barScale(count) }}/>
      </div>
    );
  }

  render() {
    const { option } = this.props;


    return (
      <div className="NumberedSelectOption">
        <div className='option-label'>{option.label}</div>
        {this.renderCount()}
      </div>
    );
  }
}

NumberedSelectOption.propTypes = propTypes;

export default NumberedSelectOption;
