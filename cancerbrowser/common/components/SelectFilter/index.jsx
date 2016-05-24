import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Select from 'react-select';

const propTypes = {
  /* The list of items to render
    [
      { value: 'big6', label: 'Big 6' },
      { value: 'icbp43', label: 'ICBP43' }
    ]
  */
  items: React.PropTypes.array.isRequired,

  // The toggled value e.g. 'big6' or 'icbp43'
  value: React.PropTypes.string,

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
};

const defaultProps = {
};

/**
 * List component where you can click each item to toggle it on or off
 * Also includes visual encoding of number of results that are affected
 */
class SelectFilter extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.handleAutocompleterChange = this.handleAutocompleterChange.bind(this);
  }

  handleAutocompleterChange(newValue) {
    const { onChange } = this.props;

    if (onChange) {
      onChange(newValue.value);
    }
  }

  render() {
    const { items, values } = this.props;

    return (
      <div className="SelectFilter">
        <Select options={items} value={values} onChange={this.handleAutocompleterChange} />
      </div>
    );
  }
}

SelectFilter.propTypes = propTypes;
SelectFilter.defaultProps = defaultProps;

export default SelectFilter;
