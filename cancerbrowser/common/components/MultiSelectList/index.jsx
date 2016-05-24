import React from 'react';
import d3 from 'd3';
import classNames from 'classnames';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as ImmutableUtils from '../../utils/ImmutableUtils';

import './multi_select_list.scss';

const propTypes = {
  /* The list of items to render
    [
      { value: 'big6', label: 'Big 6', cellLines: [...] },
      { value: 'icbp43', label: 'ICBP43', cellLines: [...] }
    ]
  */
  items: React.PropTypes.array.isRequired,

  /* The toggled values, an array of 'value's, e.g.:
    ['big6', 'icbp43']
   */
  values: React.PropTypes.array,

  /*
   * Mapping from items 'value' to count to show on the right
   * e.g.
   {
      big6: 6,
      icbp43: 43
   }
   */
  counts: React.PropTypes.object,

  /*
   * Number used as maximum count for scaling the bars that go along with counts
   * If not provided, the max of the values provided is used
   */
  countMax: React.PropTypes.number,

  /*
   * Fired when the selected items change, typically by clicking an item
   */
  onChange: React.PropTypes.func
};

const defaultProps = {
  values: []
};

/**
 * List component where you can click each item to toggle it on or off
 * Also includes visual encoding of number of results that are affected
 */
class MultiSelectList extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  handleClickItem(value) {
    const { onChange, values } = this.props;

    if (onChange) {
      let newValues;
      const valueIndex = values.indexOf(value);

      // remove if already there
      if (valueIndex !== -1) {
        newValues = ImmutableUtils.arrayRemove(values, valueIndex);

      // otherwise, add into the array
      } else {
        newValues = values.concat(value);
      }

      onChange(newValues);
    }
  }

  renderItem(item, barScale, index) {
    const { values, counts } = this.props;

    // if counts have been provided, render them
    const showCounts = !!counts;
    let count;
    if (showCounts) {
      const countValue = counts[item.value];
      count = (
        <div className='item-count'>
          <span className='item-count-value'>{counts[item.value]}</span>
          <div className='item-count-bar' style={{ width: barScale(countValue) }}/>
        </div>
      );
    }

    return (
      <li key={index}
        className={classNames({ active: values.indexOf(item.value) !== -1 })}
        onClick={this.handleClickItem.bind(this, item.value)}>
        <div className='item-label'>{item.label}</div>
        {count}
      </li>
    );
  }

  getBarScale() {
    let { countMax, counts } = this.props;
    if (!counts) {
      return null;
    }

    if (countMax == null) {
      countMax = d3.max(Object.keys(counts).map(key => counts[key]));
    }

    const maxBarWidth = 32;
    const barScale = d3.scale.linear().domain([0, countMax]).range([0, maxBarWidth]);

    return barScale;
  }

  render() {
    const { items, counts } = this.props;

    const barScale = this.getBarScale();

    return (
      <ul className={classNames('MultiSelectList list-unstyled', { 'has-counts': !!counts })}>
        {items.map((item, i) => {
          return this.renderItem(item, barScale, i);
        })}
      </ul>
    );
  }
}

MultiSelectList.propTypes = propTypes;
MultiSelectList.defaultProps = defaultProps;

export default MultiSelectList;
