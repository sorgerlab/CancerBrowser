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
    this.handleSortChange = this.handleSortChange.bind(this);

    this.state = {
      sortDir: {}
    };
  }

  cellLineColumn(data) {
    const sortDir = this.state.sortDir.cellLine;

    return (
      <Column
        key='cellLine'
        columnKey='cellLine'
        cell={props => (
          <Cell {...props}>{data[props.rowIndex].CellLine}</Cell>
        )}
        header={<SortableTableHeaderCell onSortChange={this.handleSortChange} sortDir={sortDir}>Cell Line</SortableTableHeaderCell>}
        width={150} />
    );
  }

  receptorStatusColumn(data) {
    const sortDir = this.state.sortDir.receptorStatus;
    return (
      <Column
        key='receptorStatus'
        columnKey='receptorStatus'
        cell={props => (
          <Cell {...props}>{data[props.rowIndex].ReceptorStatus}</Cell>
        )}
        header={<SortableTableHeaderCell onSortChange={this.handleSortChange} sortDir={sortDir}>Receptor Status</SortableTableHeaderCell>}
        width={150} />
    );
  }

  molecularSubtypeColumn(data) {
    const sortDir = this.state.sortDir.molecularSubtype;
    return (
      <Column
        key='molecularSubtype'
        columnKey='molecularSubtype'
        cell={props => (
          <Cell {...props}>{data[props.rowIndex].MolecularSubtype}</Cell>
        )}
        header={<SortableTableHeaderCell onSortChange={this.handleSortChange} sortDir={sortDir}>Molecular Subtype</SortableTableHeaderCell>}
        width={200} />
    );
  }

  mutationStatusColumn(data, gene) {
    const sortDir = this.state.sortDir.gene;
    return (
      <Column
        key={gene}
        columnKey={gene}
        cell={props => (
          <Cell {...props}>{data[props.rowIndex][`${gene}`]}</Cell>
        )}
        header={<SortableTableHeaderCell onSortChange={this.handleSortChange} sortDir={sortDir}>{gene}</SortableTableHeaderCell>}
        width={80} />
    );
  }

  mutationStatusColumns(data) {
    return (
      <ColumnGroup
        key='mutationStatus'
        header={<Cell>Mutation Status</Cell>}>
        {mutationGenes.map(gene => this.mutationStatusColumn(data, gene))}
      </ColumnGroup>
    );
  }

  summaryViewColumns(data) {
    return [(
      <ColumnGroup key={'nonMutation'}>
        {this.cellLineColumn(data)}
        {this.receptorStatusColumn(data)}
        {this.molecularSubtypeColumn(data)}
      </ColumnGroup>),
      this.mutationStatusColumns(data)
    ];
  }

  handleSortChange(columnKey, sortDir) {
    console.log('sort!', columnKey, sortDir);
    this.setState({
      sortDir: { [columnKey]: sortDir}
    });
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
