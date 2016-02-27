import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {
  fetchDatasetsIfNeeded,
  fetchCellsIfNeeded,
  fetchCellsInDatasetsIfNeeded
} from './actions';

class Cell extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchDatasetsIfNeeded());
    dispatch(fetchCellsIfNeeded());
    dispatch(fetchCellsInDatasetsIfNeeded());
  }

  render() {
    const { datasets, isFetchingDatasets,
            cells, subtypes, isFetchingCells,
            cellsInDatasets, isFetchingCellsInDatasets } = this.props;

    let cellOptions;
    if (cells) {
      cellOptions = Object.keys(cells).map(cellId => {
        const cell = cells[cellId];
        return {
          value: cellId,
          label: cell.name
        };
      })
    }

    let subtypeOptions;
    if (subtypes) {
      subtypeOptions = Object.keys(subtypes).map(subtypeId => {
        const subtype = subtypes[subtypeId];
        return {
          value: subtypeId,
          label: subtype
        };
      })
    }

    let datasetItems;
    if (datasets) {
      datasetItems = Object.keys(datasets).map(datasetId => {
        const dataset = datasets[datasetId];
        return (
          <li key={ dataset.id }><a href="#"><span className="badge">{ dataset.category }</span> { dataset.name }</a></li>
        );
      });
    }

    let children;
    if (this.props.children) {
      children = React.cloneElement(
        this.props.children,
        {
          datasets: datasets,
          cells: cells,
          cellsInDatasets: cellsInDatasets
        }
      );
    }

    return (
      <div>
        <h1>Cell</h1>

        <div className="row">

          <div className="col-md-4">
            <Select
                name="subtype_filter"
                placeholder="Subtypes..."
                options={ subtypeOptions }
            />
          </div>

          <div className="col-md-4">
            <Select
                name="cell_filter"
                placeholder="Cells..."
                options={ cellOptions }
            />
          </div>

        </div>

        <p>Browse Data</p>
        <ul>
          { datasetItems }
        </ul>

        <Link to="/Cell/Cube" className="btn btn-lg btn-default" role="button">Cube</Link>
        { children }
    </div>
    );
  }
}

function mapStateToProps(state) {

  const {
    isFetching: isFetchingDatasets,
    items: datasets
  } = state.datasets;

  const {
    isFetching: isFetchingCells,
    items: cells,
    subtypes: subtypes
  } = state.cells;

  const {
    isFetching: isFetchingCellsInDatasets,
    items: cellsInDatasets
  } = state.cellsInDatasets;

  return {
    datasets,
    cells,
    subtypes,
    cellsInDatasets,
    isFetchingDatasets,
    isFetchingCells,
    isFetchingCellsInDatasets
  }
}

export default connect(mapStateToProps)(Cell)
