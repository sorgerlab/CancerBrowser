import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import MultiSelectList from '../MultiSelectList';

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
  onChange: React.PropTypes.func,

  // if the number of items supplied is > this, the element is rendered as an autocompleter
  autocompleteThreshold: React.PropTypes.number
};

const defaultProps = {
  autocompleteThreshold: 10
};

/**
 * List component where you can click each item to toggle it on or off
 * Also includes visual encoding of number of results that are affected
 */
class MultiSelectFilter extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  renderAutocompleter() {
    return (
      <div>
        Autocompleter TODO
      </div>
    );
  }

  renderList() {
    const { items, values, onChange, numbers } = this.props;

    return (
      <MultiSelectList items={items} values={values} numbers={numbers} onChange={onChange} />
    );
  }

  render() {
    const { items, autocompleteThreshold } = this.props;

    return (
      <div className="MultiSelectFilter">
        {items.length > autocompleteThreshold ? this.renderAutocompleter() : this.renderList()}
      </div>
    );
  }
}

MultiSelectFilter.propTypes = propTypes;
MultiSelectFilter.defaultProps = defaultProps;

export default MultiSelectFilter;
