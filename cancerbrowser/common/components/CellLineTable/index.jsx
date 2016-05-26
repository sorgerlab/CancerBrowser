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

function commaListLabelRenderer(val) {
  return val.map(item => item.label).join(', ');
}

/** Define all table columns here */
const allColumns = {
  cellLine: {
    prop: 'cellLine',
    title: 'Cell Line',
    // since render doesn't result in a simple string, we can't use it for sorting
    // so we provide sortValue
    sortValue: (val) => val.label,
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

    /**
     * Render:
     *  - "No data" if there is no mutation data,
     *  - "All WT" if all genes are wild type
     *  - Otherwise a comma separated list of mutated genes
     *
     * @param {Array} array of mutated gene values
     * @return {String}
     */
    render(val) {
      if (/nodata$/.test(val[0].value)) {
        return 'No data';
      }

      const mutations = val.filter(gene => /mut$/.test(gene.value));

      if (!mutations.length) {
        return 'All WT';
      }

      // take just the gene names, comma separated
      return mutations.map(gene => gene.label.split(' ')[0]).join(', ');
    },

    // sets the class to no-data if there is no gene data
    className(val) {
      if (/nodata$/.test(val[0].value)) {
        return 'no-data';
      }
    }
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
      return 'no-data';
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


// helper function to normalize a string for search comparison by lower casing and trimming
function normalizeString(str) {
  return String(str).toLowerCase().trim();
}

/* function for searching the table column labels as opposed to assuming
 * all the values are strings.
 *
 * @param {String} query The string to search for in the cell data
 * @param {Object|Array|String|Number} cellData the data corresponding to the cell
 *
 * @return {Boolean} true if query is found in the cell data, false otherwise
 */
function labelContainsIgnoreCase(query, cellData) {
  // normalize the query
  const normalizedQuery = normalizeString(query);

  let match;
  // If the cellData is an object with a label, use that as the string to search in
  if (cellData && cellData.label) {
    match = normalizeString(cellData.label).indexOf(normalizedQuery) !== -1;

  // If the cell data is an array, check if the match happens in any element
  } else if (_.isArray(cellData)) {
    match = cellData.some(item => labelContainsIgnoreCase(normalizedQuery, item));
  // otherwise just treat the cellData as the string to search in (default case)
  } else {
    match = normalizeString(cellData).indexOf(normalizedQuery) !== -1;
  }

  return match;
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
        initialPageLength={100}
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
