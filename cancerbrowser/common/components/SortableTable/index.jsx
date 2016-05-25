import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';
import { DataMixin, Table, Pagination } from 'react-data-components';

const propTypes = {
  initialData: React.PropTypes.array,
  initialPageLength: React.PropTypes.number,
  initialSortBy: React.PropTypes.object,
  columns: React.PropTypes.array,
  keys: React.PropTypes.array,
  className: React.PropTypes.string,
  buildRowOptions: React.PropTypes.func,
  paginate: React.PropTypes.bool
};

const defaultProps = DataMixin.getDefaultProps();

/** A way to render options in react-select that includes a bar and count */
class SortableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = DataMixin.getInitialState.call(this);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.componentWillReceiveProps = DataMixin.componentWillReceiveProps.bind(this);
    this.componentWillMount = DataMixin.componentWillMount.bind(this);
    this.onSort = DataMixin.onSort.bind(this);
    this.onFilter = DataMixin.onFilter.bind(this);
    this.buildPage = DataMixin.buildPage.bind(this);
    this.onChangePage = DataMixin.onChangePage.bind(this);
    this.onPageLengthChange = DataMixin.onPageLengthChange.bind(this);
  }

  renderPagination(page) {
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
    const { columns, keys, buildRowOptions, className, paginate } = this.props;

    let data, page;
    if (paginate) {
      page = this.buildPage();
      data = page.data;
    } else {
      data = this.state.data;
    }

    return (
      <div className={classNames('SortableTable', className)}>
        {this.renderPagination(page)}
        <Table
          className="table table-bordered"
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
