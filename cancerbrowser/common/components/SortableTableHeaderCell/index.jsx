import React from 'react';
import { Cell } from 'fixed-data-table';

export const SortDirections = { Asc: true, Desc: false };

const propTypes = {
  sortDir: React.PropTypes.oneOf([SortDirections.Asc, SortDirections.Desc]),
  columnKey: React.PropTypes.string,
  onSortChange: React.PropTypes.func,
  children: React.PropTypes.any
};

class SortableTableHeaderCell extends React.Component {
  constructor(props) {
    super(props);

    this.handleSortChange = this.handleSortChange.bind(this);
  }

  render() {
    var { sortDir, children, ...props } = this.props;

    return (
      <Cell {...props}>
        <span onClick={this.handleSortChange}>
          {children}
          {sortDir == null ? null : (
            <span className='sort-direction-icon'>{sortDir === SortDirections.Desc ? '↓' : '↑'}</span>)}
        </span>
      </Cell>
    );
  }

  handleSortChange(evt) {
    const { columnKey, sortDir, onSortChange } = this.props;

    if (onSortChange) {
      onSortChange(columnKey, !sortDir);
    }

    evt.preventDefault();
  }
}

SortableTableHeaderCell.propTypes = propTypes;

export default SortableTableHeaderCell;
