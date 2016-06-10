import React from 'react';
import d3 from 'd3';
import classNames from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';
import * as ImmutableUtils from '../../utils/immutable_utils';

import './multi_select_list.scss';

const propTypes = {
  /* The list of items to render. Can optionally include a color to add a color icon on render
    [
      { value: 'big6', label: 'Big 6' },
      { value: 'icbp43', label: 'ICBP43' }
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
  }

  /**
   * Lifecycle method to determine update
   */
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  /**
   * Callback when an item is clicked in the list
   *
   * @param {String} value The value of the item clicked
   */
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

  /**
   * Renders an item in the list
   *
   * @param {Object} item The item to be rendered (e.g. { label: '', value: '' })
   * @param {Function} barScale A d3 scale for drawing the bars
   * @param {Number} index The index of the item in the collection of items
   */
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

    let colorIcon;
    if (item.color) {
      colorIcon = <span className='color-icon' style={{ backgroundColor: item.color }} />;
    }

    return (
      <li key={index}
        className={classNames({ active: values.indexOf(item.value) !== -1 })}
        onClick={this.handleClickItem.bind(this, item.value)}>
        <div className='item-label'>{colorIcon}{item.label}</div>
        {count}
      </li>
    );
  }

  /**
   * Returns a d3 scale for getting bar widths representing the count value
   *
   * @return {Function} A d3 scale
   */
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

  /**
   * Main render method
   */
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
