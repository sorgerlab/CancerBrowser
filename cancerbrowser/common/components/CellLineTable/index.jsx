import React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import SortableTable from '../SortableTable';
import { Icon } from 'react-fa';

// TODO: get this from the shared location
const mutationGenes = ['BRCA1', 'BRCA2', 'CDH1', 'MAP3K1', 'MLL3', 'PIK3CA', 'PTEN', 'TP53', 'GATA3', 'MAP2K4'];

function labelRenderer(val) {
  return val.label;
}

function listLabelRenderer(val) {
  return (
    <ul className='list-inline'>
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
    render() {
      return <Icon name='bar-chart' />;
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
  title: gene
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
        keys={['id']}
        columns={columnSet}
        initialData={data}
        initialPageLength={30}
        paginate={true}
        initialSortBy={{ prop: 'cellLine', order: 'descending' }}
      />
    );
  }
}

CellLineTable.propTypes = propTypes;
CellLineTable.defaultProps = defaultProps;

export default CellLineTable;
