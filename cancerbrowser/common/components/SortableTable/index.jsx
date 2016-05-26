import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';
import { DataMixin, Table, Pagination } from 'react-data-components';

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
  paginate: React.PropTypes.bool
};

const defaultProps = DataMixin.getDefaultProps();

// react-data-components Table caches the th width so the table doesn't change as you page
// but this is undesirable behaviour at least for when we change views, so we can get rid of
// it by making componentDidMount a no-op.
class TableNoThWidth extends Table {
  componentDidMount() {}
}

/** A way to render options in react-select that includes a bar and count */
class SortableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = DataMixin.getInitialState.call(this);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    // add in the DataMixin functions since ES6 classes do not support mixins
    this.componentWillReceiveProps = DataMixin.componentWillReceiveProps.bind(this);
    this.componentWillMount = DataMixin.componentWillMount.bind(this);
    this.onSort = DataMixin.onSort.bind(this);
    this.onFilter = DataMixin.onFilter.bind(this);
    this.buildPage = DataMixin.buildPage.bind(this);
    this.onChangePage = DataMixin.onChangePage.bind(this);
    this.onPageLengthChange = DataMixin.onPageLengthChange.bind(this);
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

  render() {
    const { columns, keys, buildRowOptions, className, tableClassName, paginate } = this.props;

    let data, page;
    if (paginate) {
      page = this.buildPage();
      data = page.data;
    } else {
      data = this.state.data;
    }

    return (
      <div className={classNames('SortableTable', className)}>
        {this.renderPager(page)}
        <TableNoThWidth
          className={classNames('table', tableClassName)}
          dataArray={data}
          columns={columns}
          keys={keys}
          buildRowOptions={buildRowOptions}
          sortBy={this.state.sortBy}
          onSort={this.onSort}
        />
      </div>
    );
  }
}

SortableTable.propTypes = propTypes;
SortableTable.defaultProps = defaultProps;

export default SortableTable;
