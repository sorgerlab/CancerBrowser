import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Table, Column, Cell, ColumnGroup } from 'fixed-data-table';
import SortableTableHeaderCell from '../SortableTableHeaderCell';

import cellLines from '../../api/data/cell_lines.json';

const mutationGenes = ['BRCA1', 'BRCA2', 'CDH1', 'MAP3K1', 'MLL3', 'PIK3CA', 'PTEN', 'TP53', 'GATA3', 'MAP2K4'];

console.log('cell lines are', cellLines);

const propTypes = {
};


/** A way to render options in react-select that includes a bar and count */
class CellLineTable extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  cellLineColumn(data) {
    return (
      <Column
        key='cell-line'
        cell={props => (
          <Cell {...props}>{data[props.rowIndex].CellLine}</Cell>
        )}
        header={<SortableTableHeaderCell>Cell Line</SortableTableHeaderCell>}
        width={150} />
    );
  }

  receptorStatusColumn(data) {
    return (
      <Column
        key='receptor-status'
        cell={props => (
          <Cell {...props}>{data[props.rowIndex].ReceptorStatus}</Cell>
        )}
        header={<SortableTableHeaderCell>Receptor Status</SortableTableHeaderCell>}
        width={150} />
    );
  }

  molecularSubtypeColumn(data) {
    return (
      <Column
        key='molecular-subtype'
        cell={props => (
          <Cell {...props}>{data[props.rowIndex].MolecularSubtype}</Cell>
        )}
        header={<SortableTableHeaderCell>Molecular Subtype</SortableTableHeaderCell>}
        width={200} />
    );
  }

  mutationStatusColumn(data, gene) {
    return (
      <Column
        key={gene}
        cell={props => (
          <Cell {...props}>{data[props.rowIndex][`${gene}`]}</Cell>
        )}
        header={<SortableTableHeaderCell>{gene}</SortableTableHeaderCell>}
        width={80} />
    );
  }

  mutationStatusColumns(data) {
    return (
      <ColumnGroup
        key={'mutation-status'}
        header={<SortableTableHeaderCell>Mutation Status</SortableTableHeaderCell>}>
        {mutationGenes.map(gene => this.mutationStatusColumn(data, gene))}
      </ColumnGroup>
    );
  }

  summaryViewColumns(data) {
    return [(
      <ColumnGroup key={'non-mutation'}>
        {this.cellLineColumn(data)}
        {this.receptorStatusColumn(data)}
        {this.molecularSubtypeColumn(data)}
      </ColumnGroup>),
      this.mutationStatusColumns(data)
    ];
  }

  render() {
    const data = cellLines;

    return (
      <Table
        className="CellLineTable"
        rowsCount={data.length}
        rowHeight={40}
        headerHeight={40}
        groupHeaderHeight={40}
        width={1600}
        height={1000}>
        {this.summaryViewColumns(data)}

      </Table>
    );
  }
}

CellLineTable.propTypes = propTypes;

export default CellLineTable;
