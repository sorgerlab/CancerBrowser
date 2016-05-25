import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import SortableTable from '../SortableTable';
import { Icon } from 'react-fa';

const propTypes = {
  data: React.PropTypes.array
};

const mutationGenes = ['BRCA1', 'BRCA2', 'CDH1', 'MAP3K1', 'MLL3', 'PIK3CA', 'PTEN', 'TP53', 'GATA3', 'MAP2K4'];

const allColumns = {
  cellLine: {
    prop: 'cellLine',
    title: 'Cell Line'
  },
  receptorStatus: {
    prop: 'receptorStatus',
    title: 'Receptor Status'
  },
  molecularSubtype: {
    prop: 'molecularSubtype',
    title: 'Molecular Subtype'
  },
  mutationStatusSummary: {
    prop: 'mutation',
    title: 'Mutation Status',
    render(val) {
      return (
        <ul className='list-inline'>
          {val.map((gene, i) => <li key={i}>{gene}</li>)}
        </ul>
      );
    }
  },
  dataset: {
    title: 'Dataset',
    render() {
      return <Icon name='bar-chart' />;
    }
  }
};

const summaryColumns = [
  allColumns.cellLine,
  allColumns.receptorStatus,
  allColumns.molecularSubtype,
  allColumns.mutationStatusSummary,
  allColumns.dataset
];

/** A way to render options in react-select that includes a bar and count */
class CellLineTable extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    const { data } = this.props;

    let columnSet;
    columnSet = summaryColumns;

    return (
      <SortableTable
        className="CellLineTable"
        keys={['cellLine']}
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

export default CellLineTable;
