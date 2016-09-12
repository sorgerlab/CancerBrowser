import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { Link } from 'react-router';
import shallowCompare from 'react-addons-shallow-compare';
import { Icon } from 'react-fa';

import * as StringUtils from '../../utils/string_utils';
import SortableTable from '../SortableTable';
import DatasetSelector from '../DatasetSelector';
import CellLineGlyph from '../CellLineGlyph';

import './cell_line_table.scss';

// TODO: get this from the shared location
const mutationGenes = ['BRCA1', 'BRCA2', 'CDH1', 'MAP3K1', 'MLL3', 'PIK3CA', 'PTEN', 'TP53', 'GATA3', 'MAP2K4'];

function labelRenderer(val) {
  return val.label;
}

/** Define all table columns here */
const allColumns = {
  cellLine: {
    prop: 'cellLine',
    title: 'Cell Line',
    // since render doesn't result in a simple string, we can't use it for sorting
    // so we provide sortValue
    sortValue: (val) => val.label,
    render(val, row) {
      return (
        <Link to={`/cell_line/${val.value}`}>
          <span className={classNames('color-icon', `bg-${row.receptorStatus.value}`)}
              title={`Receptor Status: ${row.receptorStatus.label}`} />
          {val.label}
        </Link>
      );
    },
    className: 'cell-line-td'
  },

  cellLineGlyph: {
    title: 'Mutation Summary',
    className: 'cell-line-td',
    render(val, row) {
      return (
        <CellLineGlyph cellLine={row} />
      );
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
    render: labelRenderer
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
     * @param {Array} val array of mutated gene values
     * @return {String}
     */
    render(val) {
      if (/nodata$/.test(val[0].value)) {
        return 'No data';
      }

      const mutations = val.filter(gene => /mut(\*)?$/.test(gene.value));

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
    prop: 'dataset',
    title: 'Datasets',
    render(val, data) {
      return (
        <DatasetSelector datasets={val} entityId={data.id} entityType={'cellLine'} />
      );
    }
  }
};

// Summary column set
const summaryColumns = [
  allColumns.cellLine,
  allColumns.cellLineGlyph,
  allColumns.receptorStatus,
  allColumns.molecularSubtype,
  allColumns.dataset
];

// Generate mutation columns for each gene
const mutationGenesColumns = mutationGenes.map(gene => ({
  prop: gene,
  title: gene,
  className(val) {
    if (val) {
      return `mutation-col mutation-${val.toLowerCase().replace(/\s/g, '-').replace(/[*]/g, '')}`;
    } else {
      return 'mutation-col no-data';
    }
  }
}));

// Mutations column set
const mutationColumns = [
  allColumns.cellLine,
  allColumns.cellLineGlyph,
  ...mutationGenesColumns,
  allColumns.dataset
];

// need to use a function for these since datasets is a prop of the table.
function getDatasetColumns(datasets) {
  // Generate the columns for each dataset
  const hasDatasetColumns = Object.keys(datasets).map(datasetId => {
    const dataset = datasets[datasetId];
    return {
      prop: 'dataset',
      title: dataset.label,
      sortVal(val) {
        const datasetValue = val.find(d => d.value === datasetId);
        return !!datasetValue;
      },
      render(val, data) {
        if (val.find(d => d.value === datasetId)) {
          return <Link to={`/dataset/${datasetId}/${data.id}/cellLine`}><Icon name='bar-chart'/></Link>;
        }

        return '';
      },
      className(val) {
        if (val.find(d => d.value === datasetId)) {
          return 'dataset-col has-dataset';
        } else {
          return 'dataset-col no-data';
        }
      }
    };
  });

  // Datasets column set
  const datasetColumns = [
    allColumns.cellLine,
    allColumns.cellLineGlyph,
    ...hasDatasetColumns
  ];

  return datasetColumns;
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
  const normalizedQuery = StringUtils.normalize(query);

  let match;
  // If the cellData is an object with a label, use that as the string to search in
  if (cellData && cellData.label) {
    match = StringUtils.normalize(cellData.label).indexOf(normalizedQuery) !== -1;

  // If the cell data is an array, check if the match happens in any element
  } else if (_.isArray(cellData)) {
    match = cellData.some(item => labelContainsIgnoreCase(normalizedQuery, item));
  // otherwise just treat the cellData as the string to search in (default case)
  } else {
    match = StringUtils.normalize(cellData).indexOf(normalizedQuery) !== -1;
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
  view: React.PropTypes.oneOf(Object.keys(Views).map(key => Views[key])),

  /** The object representing all datasets in the browser { datasetId: datasetDefinition } */
  datasets: React.PropTypes.object
};

const defaultProps = {
  view: Views.Summary,
  datasets: {}
};


// specify these props here so they do not get recreated each render() breaking shouldComponentUpdate
const filters = {
  globalSearch: {
    filter: labelContainsIgnoreCase
  }
};
const initialSortBy = { prop: 'cellLine', order: 'ascending' };
const keys = ['id'];

/**
 * A way to render options in react-select that includes a bar and count
 */
class CellLineTable extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Life cycle method to check if component needs to be updated
   */
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  /**
   * Main render method
   */
  render() {
    const { data, view, datasets } = this.props;

    let columnSet;
    if (view === Views.Mutations) {
      columnSet = mutationColumns;
    } else if (view === Views.Datasets) {
      columnSet = getDatasetColumns(datasets);
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
        emptyMessage={'No cell lines match the set filters.'}
      />
    );
  }
}

CellLineTable.propTypes = propTypes;
CellLineTable.defaultProps = defaultProps;

export default CellLineTable;
