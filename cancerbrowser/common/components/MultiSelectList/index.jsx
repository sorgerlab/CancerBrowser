import React from 'react';
import classNames from 'classnames';
import PureRenderMixin from 'react-addons-pure-render-mixin';

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
   * Mapping from items to render value to number match to show on the right
   * Assumes min = 0 if not specified
   * e.g.
   {
      big6: { number: 6, max: 43, min: 0 },
      icbp43: { number: 43, max: 43, min: 0 }
   }
   */
  numbers: React.PropTypes.object,

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
        newValues = values.slice(0, valueIndex).concat(values.slice(valueIndex + 1));

      // otherwise, add into the array
      } else {
        newValues = values.concat(value);
      }

      onChange(newValues);
    }
  }

  renderItem(item, index) {
    const { values } = this.props;

    return (
      <li key={index}
        className={classNames({ active: values.indexOf(item.value) !== -1 })}
        onClick={this.handleClickItem.bind(this, item.value)}>
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
MultiSelectList.defaultProps = defaultProps;

export default MultiSelectList;
