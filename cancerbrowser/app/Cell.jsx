import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchDatasetsIfNeeded, fetchCellsIfNeeded } from './actions';

class Cell extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchDatasetsIfNeeded());
    dispatch(fetchCellsIfNeeded());
  }

  render() {
    const { datasets, isFetchingDatasets,
            cells, isFetchingCells } = this.props;

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
          datasets: this.props.datasets,
          cells: this.props.cells
        }
      );
    }

    return (
      <div>
        <h1>Cell</h1>
        <div className="input-group">
          <span className="input-group-addon" id="basic-addon1">Search</span>
          <input type="text" className="form-control" placeholder="Search..." aria-describedby="basic-addon1" />
        </div>
        <p>
          <a className="btn btn-lg btn-default" href="#" role="button">by Name</a>
          <a className="btn btn-lg btn-default" href="#" role="button">by Subtype</a>
        </p>
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
    items: cells
  } = state.cells;

  return {
    datasets,
    cells,
    isFetchingDatasets,
    isFetchingCells
  }
}

export default connect(mapStateToProps)(Cell)
