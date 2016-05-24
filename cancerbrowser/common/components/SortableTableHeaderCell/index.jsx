import React from 'react';
import { Cell } from 'fixed-data-table';

export const SortDirections = { Asc: true, Desc: false };

const propTypes = {
  sortDir: React.PropTypes.oneOf([SortDirections.Asc, SortDirections.Desc]),
  columnKey: React.PropTypes.string,
  onChangeSort: React.PropTypes.func,
  children: React.PropTypes.any
};

class SortableTableHeaderCell extends React.Component {
  constructor(props) {
    super(props);

    this.handleChangeSort = this.handleChangeSort.bind(this);
  }

  render() {
    var { sortDir, children, ...props } = this.props;

    return (
      <Cell {...props}>
        <span onClick={this.handleChangeSort}>
          {children}
          {sortDir == null ? null : (
            <span className='sort-direction-icon'>(sortDir === SortDirections.Desc ? '↓' : '↑')</span>)}
        </span>
      </Cell>
    );
  }

  handleChangeSort(evt) {
    const { columnKey, sortDir, onChangeSort } = this.props;

    if (onChangeSort) {
      onChangeSort(columnKey, !sortDir);
    }

    evt.preventDefault();
  }
}

SortableTableHeaderCell.propTypes = propTypes;

export default SortableTableHeaderCell;
