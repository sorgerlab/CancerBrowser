import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Select from 'react-select';
import NumberedSelectOption from '../NumberedSelectOption';

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

  /**
   * Callback when the autocompleter changes
   *
   * @param {String} newValue The value that was selected
   */
  handleAutocompleterChange(newValue) {
    const { onChange } = this.props;

    if (onChange) {
      // only send the value along
      if (newValue) {
        onChange(newValue.value);
      } else {
        onChange(newValue);
      }
    }
  }

  render() {
    const { items, value, counts, countMax } = this.props;

    let renderOption;
    if (counts) {
      renderOption = (option) => {
        return <NumberedSelectOption option={option} count={counts[option.value]} countMax={countMax} />;
      };
    }

    return (
      <div className="SelectFilter">
        <Select
          options={items}
          value={value}
          optionRenderer={renderOption}
          onChange={this.handleAutocompleterChange} />
      </div>
    );
  }
}

SelectFilter.propTypes = propTypes;

export default SelectFilter;
