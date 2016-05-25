import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Table, Column, Cell, ColumnGroup } from 'fixed-data-table';
import { Icon } from 'react-fa';
import SortableTableHeaderCell from '../SortableTableHeaderCell';
const propTypes = {
  data: React.PropTypes.array
};

const mutationGenes = ['BRCA1', 'BRCA2', 'CDH1', 'MAP3K1', 'MLL3', 'PIK3CA', 'PTEN', 'TP53', 'GATA3', 'MAP2K4'];

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
        width={150}
        header={(
          <SortableTableHeaderCell onSortChange={this.handleSortChange} sortDir={sortDir}>
            Cell Line
          </SortableTableHeaderCell>
        )}
        cell={props => (
          <Cell {...props}>{data[props.rowIndex].CellLine}</Cell>
        )} />
    );
  }

  receptorStatusColumn(data) {
    const sortDir = this.state.sortDir.receptorStatus;
    return (
      <Column
        key='receptorStatus'
        columnKey='receptorStatus'
        width={150}
        header={(
          <SortableTableHeaderCell onSortChange={this.handleSortChange} sortDir={sortDir}>
            Receptor Status
          </SortableTableHeaderCell>
        )}
        cell={props => (
          <Cell {...props}>{data[props.rowIndex].ReceptorStatus}</Cell>
        )} />
    );
  }

  molecularSubtypeColumn(data) {
    const sortDir = this.state.sortDir.molecularSubtype;
    return (
      <Column
        key='molecularSubtype'
        columnKey='molecularSubtype'
        width={200}
        header={(
          <SortableTableHeaderCell onSortChange={this.handleSortChange} sortDir={sortDir}>
            Molecular Subtype
          </SortableTableHeaderCell>
        )}
        cell={props => (
          <Cell {...props}>{data[props.rowIndex].MolecularSubtype}</Cell>
        )} />
    );
  }

  mutationStatusColumn(data, gene) {
    const sortDir = this.state.sortDir[gene];

    return (
      <Column
        key={gene}
        columnKey={gene}
        width={80}
        header={(
          <SortableTableHeaderCell onSortChange={this.handleSortChange} sortDir={sortDir}>
            {gene}
          </SortableTableHeaderCell>
        )}
        cell={props => (
          <Cell {...props}>{data[props.rowIndex][`${gene}`]}</Cell>
        )} />
    );
  }

  mutationStatusSummaryColumn(data) {
    const sortDir = this.state.sortDir.mutationStatusSummary;

    return (
      <Column
        key='mutationStatusSummary'
        columnKey='mutationStatusSummary'
        width={520}
        header={(
          <SortableTableHeaderCell onSortChange={this.handleSortChange} sortDir={sortDir}>
            Mutation Status
          </SortableTableHeaderCell>
        )}
        cell={props => (
          <Cell {...props}>
            <ul className='list-inline'>
              {mutationGenes.map(gene => <li key={gene} style={{ width: 50 }}>{data[props.rowIndex][`${gene}`]}</li>)}
            </ul>
          </Cell>
        )} />
    );
  }

  datasetColumn(data) {
    // TODO: this should be a dropdown menu of short links to the dastaset
    // landing pages that are available for the given cell line
    return (
      <Column
        key='dataset'
        columnKey='dataset'
        width={80}
        header={(
          <Cell>
            Dataset
          </Cell>
        )}
        cell={props => (
          <Cell {...props}>
            <Icon name='bar-chart' />
          </Cell>
        )} />
    );
  }


  summaryViewColumns(data) {
    return [
      this.cellLineColumn(data),
      this.receptorStatusColumn(data),
      this.molecularSubtypeColumn(data),
      this.mutationStatusSummaryColumn(data),
      this.datasetColumn(data)
    ];
  }

  handleSortChange(columnKey, sortDir) {
    console.log('sort!', columnKey, sortDir);
    this.setState({
      sortDir: { [columnKey]: sortDir}
    });
  }

  render() {
    const { data } = this.props;

    const rowHeight = 40;
    const headerHeight = 40;
    const height = rowHeight * data.length + headerHeight + 2;

    return (
      <Table
        className="CellLineTable"
        rowsCount={data.length}
        rowHeight={rowHeight}
        headerHeight={headerHeight}
        groupHeaderHeight={40}
        width={1200}
        height={height}>
        {this.summaryViewColumns(data)}

      </Table>
    );
  }
}

CellLineTable.propTypes = propTypes;

export default CellLineTable;
