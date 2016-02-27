import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {
  fetchDatasetsIfNeeded,
  fetchCellsIfNeeded,
  fetchCellsInDatasetsIfNeeded,
  changeCellFilter,
  changeCellSubtypeFilter
} from './actions';

class Cell extends React.Component {

  constructor() {
    super();
    this.handleChangeSubtypeFilter = this.handleChangeSubtypeFilter.bind(this);
    this.handleChangeCellFilter = this.handleChangeCellFilter.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchDatasetsIfNeeded());
    dispatch(fetchCellsIfNeeded());
    dispatch(fetchCellsInDatasetsIfNeeded());
  }

  handleChangeSubtypeFilter(value) {
    const { dispatch } = this.props;
    if (value) {
      dispatch(changeCellSubtypeFilter(value.value));
    } else {
      dispatch(changeCellSubtypeFilter(undefined));
    }
  }

  handleChangeCellFilter(value) {
    const { dispatch } = this.props;
    if (value) {
      dispatch(changeCellFilter(value.value));
    } else {
      dispatch(changeCellFilter(undefined));
    }
  }

  render() {
    const { datasets, isFetchingDatasets,
            cells, subtypes, isFetchingCells,
            cellsInDatasets, isFetchingCellsInDatasets,
            cellFilter, subtypeFilter } = this.props;

    // TODO Tidy up, this is all very messy
    // Probably a good idea to make default state for list variables to be
    // empty lists. That way there would be a lot less checking for undefined
    // variable. That will mean adding a way to check if the data should be
    // loaded other than the variable being undefined.

    let filteredCellIds;
    if (cells) {
      if (subtypeFilter) {
        filteredCellIds = Object.keys(cells).filter(cellId => {
          const cell = cells[cellId];
          return (cell.subtypes.indexOf(subtypeFilter) !== -1);
        });
      } else {
        // Do not filter out any cells
        filteredCellIds = Object.keys(cells);
      }
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

    let cellOptions;
    if (filteredCellIds) {
      cellOptions = filteredCellIds.map(cellId => {
        const cell = cells[cellId];
        return {
          value: cellId,
          label: cell.name
        };
      })
    }

    let resultingCellIds;
    if (cellFilter) {
      resultingCellIds = [cellFilter];
    } else if (filteredCellIds) {
      resultingCellIds = filteredCellIds;
    }

    let filteredDatasetIds;
    if (datasets && cellsInDatasets && (cellFilter || subtypeFilter)) {
      filteredDatasetIds = Object.keys(datasets).filter(datasetId => {
        const datasetCells = cellsInDatasets[datasetId];
        if (!datasetCells) {
          return false;
        }
        // Looks for the cells in this dataset in the major list
        // TODO This especially is not optimal, probably precalculate these
        // and serve them with the data or at least memoise
        return datasetCells.filter(datasetCell => {
          return (resultingCellIds.indexOf(datasetCell) != -1);
        }).length > 0;
      });
    }

    let datasetItems;

    if (datasets) {
      let resultingDatasetIds = filteredDatasetIds || Object.keys(datasets);
      datasetItems = resultingDatasetIds.map(datasetId => {
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
                value={ subtypeFilter }
                onChange={ this.handleChangeSubtypeFilter }
            />
          </div>

          <div className="col-md-4">
            <Select
                name="cell_filter"
                placeholder="Cells..."
                options={ cellOptions }
                value={ cellFilter}
                onChange={ this.handleChangeCellFilter }
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

  const {
    cell: cellFilter,
    subtype: subtypeFilter
  } = state.cellFilter;

  return {
    datasets,
    cells,
    subtypes,
    cellsInDatasets,
    isFetchingDatasets,
    isFetchingCells,
    isFetchingCellsInDatasets,
    cellFilter,
    subtypeFilter
  }
}

export default connect(mapStateToProps)(Cell)
