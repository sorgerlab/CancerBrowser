import React from 'react';

import './multi_select_list.scss';

const propTypes = {
  /* The list of items to render
    [
      { value: 'big6', label: 'Big 6', cellLines: [...] },
      { value: 'icbp43', label: 'ICBP43', cellLines: [...] }
    ]
  */
  items: React.PropTypes.array,

  /* The toggled values, an array of 'value's, e.g.:
    ['big6', 'icbp43']
   */
  values: React.PropTypes.array,

  /*
   * Mapping from items to render value to number match to show on the right
   * Assumes min = 0 if not specified
   * e.g.
   {
      big6: { number: 6, max: 43, min: 0 },
      icbp43: { number: 43, max: 43, min: 0 }
   }
   */
  numbers: React.PropTypes.object
};

/**
 * List component where you can click each item to toggle it on or off
 * Also includes visual encoding of number of results that are affected
 */
class MultiSelectList extends React.Component {

  renderItem(item, index) {
    return (
      <li key={index}>
        {item.label}
      </li>
    );
  }

  render() {
    const { items } = this.props;

    return (
      <ul className="MultiSelectList list-unstyled">
        {items.map((item, i) => {
          return this.renderItem(item, i);
        })}
      </ul>
    );
  }
}

MultiSelectList.propTypes = propTypes;

export default MultiSelectList;
