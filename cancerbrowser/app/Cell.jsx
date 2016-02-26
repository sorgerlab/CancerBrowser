import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchDatasetsIfNeeded } from './actions';

class Cell extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchDatasetsIfNeeded());
  }

  render() {
    const { datasets, isFetching } = this.props;

    let datasetItems;
    if (datasets) {
      datasetItems = Object.keys(datasets).map(datasetId => {
        const dataset = datasets[datasetId];
        return (
          <li key={ dataset.id }><a href="#"><span className="badge">{ dataset.category }</span> { dataset.name }</a></li>
        );
      });
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
        {this.props.children}
    </div>
    );
  }
}

function mapStateToProps(state) {
  // const { datasets } = state;

  if (state.datasets === undefined) {
    console.log('It was undefined');
  }

  const {
    isFetching,
    items: datasets
  } = state.datasets;

  if (isFetching == true) {
    console.log("It's fetching");
  }

  return {
    datasets,
    isFetching
  }
}

export default connect(mapStateToProps)(Cell)
