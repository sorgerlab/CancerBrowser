import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import _ from 'lodash';
import classNames from 'classnames';
import { DataMixin, Table, Pagination, utils } from 'react-data-components';
import './sortable_table.scss';

// Note many of these properties are matched to react-data-components/DataTable
const propTypes = {
  // An array of table row data to begin with (before sorting)
  initialData: React.PropTypes.array,

  /* the initial size of a page (currently no support for changing page sizes, so this will be
   * the only page size used */
  initialPageLength: React.PropTypes.number,

  // how to initially sort the table e.g. { prop: 'cellLine', order: 'descending' }
  initialSortBy: React.PropTypes.object,

  // Object mapping filter names to functions 'globalSearch' key is used for main search
  // e.g. filters: { globalSearch: { filter: containsIgnoreCase }}
  filters: React.PropTypes.object,

  // the column definitions for the table: an array of objects matching DataTable expectation
  columns: React.PropTypes.array,

  // the properties in the data rows that uniquely identify the rows
  keys: React.PropTypes.array,

  // the class name for the table container
  className: React.PropTypes.string,

  // the class name for the table tag itself
  tableClassName: React.PropTypes.string,

  // a function from row -> props object applied to <tr> elements
  buildRowOptions: React.PropTypes.func,

  // whether or not to paginate
  paginate: React.PropTypes.bool,

  // whether or not to have a search field
  searchable: React.PropTypes.bool,

  // function to use for sorting. takes sortByValues (prop, order),
  // the data to sort as args, and the column definitions
  sort: React.PropTypes.func,

  // A message to show when the table is empty
  emptyMessage: React.PropTypes.string
};

let sortableTableIds = 0;

/**
 * A function that uses the sortValue or render function configured on
 * the column if it is available, otherwise reads the prop from the row
 * data.
 *
 * @param {Object} {prop, order} prop is the key for the cell's value in the data
 *                               order is ascending or descending
 * @param {Array} data The array of data to sort
 * @param {columns} columns The columns configuration for SortableTable
 *
 * @return {Array} The sorted data
 */
function sortValueSort({ prop, order }, data, columns) {
  const column = columns.find(col => col.prop === prop);

  // if sort value is configured, use it to get the value from the row
  // otherwise, use the render function if provided
  // if nothing provided, just use the value
  let getValue;
  if (column && column.sortValue) {
    getValue = row => column.sortValue(row[prop], row);
  } else if (column && column.render) {
    getValue = row => column.render(row[prop], row);
  } else {
    getValue = row => row[prop];
  }

  const sortedData = _.sortBy(data, getValue);
  if (order === 'descending') {
    sortedData.reverse();
  }

  return sortedData;
}

const defaultProps = Object.assign({}, DataMixin.getDefaultProps(), {
  sort: sortValueSort
});

// react-data-components Table caches the th width so the table doesn't change as you page
// but this is undesirable behaviour at least for when we change views, so we can get rid of
// it by making componentDidMount a no-op.
class TableNoThWidth extends Table {
  componentDidMount() {}
}

/**
 * A way to render options in react-select that includes a bar and count
 */
class SortableTable extends React.Component {
  constructor(props) {
    super(props);
    this.id = sortableTableIds++;
    this.state = DataMixin.getInitialState.call(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.onSort = this.onSort.bind(this);

    // add in the DataMixin functions since ES6 classes do not support mixins
    this.componentWillMount = DataMixin.componentWillMount.bind(this);
    this.onFilter = DataMixin.onFilter.bind(this);
    this.buildPage = DataMixin.buildPage.bind(this);
    this.onChangePage = DataMixin.onChangePage.bind(this);
    this.onPageLengthChange = DataMixin.onPageLengthChange.bind(this);
  }

  /**
   * Lifecycle method for checking update.
   */
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  // slighlty modified from react-data-components since we do not want filterValues to reset
  // each time new props are received.
  componentWillReceiveProps(nextProps) {
    const newState = {
      data: nextProps.initialData && nextProps.initialData.slice(0),
      currentPage: 0,
      pageLength: nextProps.initialPageLength
    };

    if (this.props.initialSortBy !== nextProps.initialSortBy) {
      newState.sortBy = nextProps.initialSortBy;
    }

    if (newState.data && this.state.filterValues.globalSearch) {
      // duplicated from DataMixin.onFilter to maintain filter/sort state when data is filtered externally
      newState.data = utils.filter(nextProps.filters, this.state.filterValues, newState.data);
      newState.data = utils.sort(this.state.sortBy || newState.sortBy, newState.data);
    }

    this.setState(newState);
  }


  handleSearchChange(evt) {
    this.onFilter('globalSearch', evt.target.value);
  }

  /**
   * Renders the search bar which enables filtering the table based on
   * matching substrings in any of the columns
   */
  renderSearch() {
    const { searchable } = this.props;

    if (!searchable) {
      return null;
    }

    return (
      <div className='search-container'>
        <label className='small-label'>Search</label>
        <input
          className='form-control'
          type="search"
          value={this.state.filterValues.globalSearch || ''} // || '' prevents switching to an uncontrolled component on undefined/null
          onChange={this.handleSearchChange}
          placeholder="Search the table..."
        />
      </div>
    );
  }

  /**
   * Render the pager above the table if pagination is enabled and there is
   * more than one page.
   *
   * @param {Object} page Output from DataMixin.buildPage
   * @return {React.Component}
   */
  renderPager(page) {
    const { paginate } = this.props;

    if (!paginate || page.totalPages < 2) {
      return null;
    }

    return (
      <Pagination
        className="pagination pull-right"
        currentPage={page.currentPage}
        totalPages={page.totalPages}
        onChangePage={this.onChangePage}
      />
    );
  }

  /**
   * Handler for when a header is clicked to sort the data
   *
   * @param {Object} sortBy Object with { prop, order } where prop maps to a key
   *                        in the data, and order is ascending or descending
   */
  onSort(sortBy) {
    const { sort, columns } = this.props;
    const { data } = this.state;

    this.setState({
      sortBy,
      data: sort(sortBy, data, columns)
    });
  }

  /**
   * Main render method
   */
  render() {
    const { columns, keys, buildRowOptions, className, tableClassName, paginate, emptyMessage } = this.props;

    let data, page;
    if (paginate) {
      page = this.buildPage();
      data = page.data;
    } else {
      data = this.state.data;
    }

    return (
      <div className={classNames('SortableTable', className)}>
        {this.renderSearch()}
        {this.renderPager(page)}
        {(!data || !data.length) ? (
          <p className='empty-message'>{emptyMessage}</p>
        ) : (
          <TableNoThWidth
            className={classNames('table', tableClassName)}
            dataArray={data}
            columns={columns}
            keys={keys}
            buildRowOptions={buildRowOptions}
            sortBy={this.state.sortBy}
            onSort={this.onSort}
          />
        )}
      </div>
    );
  }
}

SortableTable.propTypes = propTypes;
SortableTable.defaultProps = defaultProps;

export default SortableTable;
