import React from 'react';
import { Link } from 'react-router';

class Home extends React.Component {
  render() {
    return (

      <div className="jumbotron">
        <h1>HMS LINCS Cancer Browser</h1>
        <p className="lead">Cras justo odio, dapibus ac facilisis in, egestas eget quam. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
        <p>
          <Link to="/Cell" className="btn btn-lg btn-default" role="button">Cell</Link>
        </p>

      </div>

    );
  }
}

export default Home;
