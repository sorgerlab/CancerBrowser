import React from 'react';
import { Link, IndexLink } from 'react-router';
import '../../client/assets/app.css';

export default class CancerBrowser extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="header clearfix">
          <nav>
            <ul className="nav nav-pills pull-right">
              <li role="presentation" className="active"><IndexLink to="/">Home</IndexLink></li>
              <li role="presentation"><Link to="/about">About</Link></li>
            </ul>
          </nav>
          <h3 className="text-muted">HMS LINCS Cancer Browser</h3>
        </div>

        {this.props.children}

        <footer className="footer">
          <p>© 2016 Sorger Lab, Harvard Medical School</p>
        </footer>

      </div>
    );
  }
}

// select db_reagent.facility_id, db_reagent.lincs_id, name FROM db_reagent JOIN db_reagentbatch ON db_reagent.id=db_reagentbatch.reagent_id JOIN db_dataset_cells ON db_reagentbatch.id=db_dataset_cells.cellbatch_id JOIN db_dataset ON db_dataset.id=db_dataset_cells.dataset_id WHERE db_dataset.facility_id='20137';
