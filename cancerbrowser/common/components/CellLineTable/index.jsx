import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import SortableTable from '../SortableTable';
import { Icon } from 'react-fa';

import './cell_line_table.scss';

// TODO: get this from the shared location
const mutationGenes = ['BRCA1', 'BRCA2', 'CDH1', 'MAP3K1', 'MLL3', 'PIK3CA', 'PTEN', 'TP53', 'GATA3', 'MAP2K4'];

function labelRenderer(val) {
  return val.label;
}

function listLabelRenderer(val) {
  return (
    <ul className='list-inline label-list'>
      {val.map((item, i) => <li key={i}>{item.label}</li>)}
    </ul>
  );
}

function commaListLabelRenderer(val) {
  return val.map(item => item.label).join(', ');
}

/** Define all table columns here */
const allColumns = {
  cellLine: {
    prop: 'cellLine',
    title: 'Cell Line',
    render(val) {
      return <Link to={`/cell_line/${val.value}`}>{val.label}</Link>;
    }
  },
  receptorStatus: {
    prop: 'receptorStatus',
    title: 'Receptor Status',
    render: labelRenderer
  },
  molecularSubtype: {
    prop: 'molecularSubtype',
    title: 'Molecular Subtype',
    render: commaListLabelRenderer
  },
  mutationStatusSummary: {
    prop: 'mutation',
    title: 'Mutation Status',
    render: listLabelRenderer
  },
  dataset: {
    title: 'Dataset',
    render(val, row) {
      return (
        <DropdownButton bsStyle='default' pullRight bsSize='sm'
            id={`dataset-dropdown-${row.id}`} // ID is apparently needed for accessibility
            title={<Icon name='bar-chart' title='Explore Datasets' />}>
          <MenuItem eventKey="1">Dataset 1</MenuItem>
          <MenuItem eventKey="2">Dataset 2</MenuItem>
          <MenuItem eventKey="3">Dataset 3</MenuItem>
        </DropdownButton>
      );
    }
  }
};

// Summary column set
const summaryColumns = [
  allColumns.cellLine,
  allColumns.receptorStatus,
  allColumns.molecularSubtype,
  allColumns.mutationStatusSummary,
  allColumns.dataset
];

// Generate mutation columns for each gene
const mutationGenesColumns = mutationGenes.map(gene => ({
  prop: gene,
  title: gene,
  className(val) {
    if (val) {
      return `mutation-${val.toLowerCase().replace(/ /g, '-')}`;
    } else {
      return 'mutation-no-data';
    }
  }
}));

// Mutations column set
const mutationColumns = [
  allColumns.cellLine,
  ...mutationGenesColumns,
  allColumns.dataset
];

// Datasets column set
const datasetColumns = [
  allColumns.cellLine
  // TODO add these in
];

// function for searching the table column labels as opposed to assuming
// all the values are strings.
function labelContainsIgnoreCase(needle, cellData) {
  let haystack;
  if (cellData && cellData.label) {
    haystack = cellData.label;
  } else if (_.isArray(cellData)) {
    haystack = cellData.map(item => item.label).join('/#--#/');
  } else {
    haystack = cellData;
  }

  needle = String(needle).toLowerCase().trim();
  haystack = String(haystack).toLowerCase().trim();
  return haystack.indexOf(needle) >= 0;
}

// Define all available views here
export const Views = {
  Mutations: 'mutations',
  Summary: 'summary',
  Datasets: 'datasets'
};

const propTypes = {
  /** An array of cell lines to render as table rows */
  data: React.PropTypes.array,

  /** Decides what column set to use. One of Views defined above */
  view: React.PropTypes.oneOf(Object.keys(Views).map(key => Views[key]))
};

const defaultProps = {
  view: Views.Summary
};


// specify these props here so they do not get recreated each render() breaking shouldComponentUpdate
const filters = {
  globalSearch: {
    filter: labelContainsIgnoreCase
  }
};
const initialSortBy = { prop: 'cellLine', order: 'descending' };
const keys = ['id'];

/** A way to render options in react-select that includes a bar and count */
class CellLineTable extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { data, view } = this.props;

    let columnSet;
    if (view === Views.Mutations) {
      columnSet = mutationColumns;
    } else if (view === Views.Datasets) {
      columnSet = datasetColumns;
    } else {
      columnSet = summaryColumns;
    }
    return (
      <SortableTable
        className="CellLineTable"
        keys={keys}
        columns={columnSet}
        initialData={data}
        initialPageLength={30}
        paginate={true}
        searchable={true}
        initialSortBy={initialSortBy}
        filters={filters}
      />
    );
  }
}

CellLineTable.propTypes = propTypes;
CellLineTable.defaultProps = defaultProps;

export default CellLineTable;
