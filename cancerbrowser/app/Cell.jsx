import React from 'react';
import { Link } from 'react-router';

export default class Cell extends React.Component {
  render() {
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
          <li><a href="#"><span className="badge">R</span> Transcriptomics I: Basal and Small Molecule-Induced Profiles</a></li>
          <li><a href="#"><span className="badge">P</span> Proteomics I: Basal RTK Profiles</a></li>
          <li><a href="#"><span className="badge">P</span> Proteomics II: Basal Total Proteomes</a></li>
          <li><a href="#"><span className="badge">P</span> Proteomics III: Basal Phosphoproteomes</a></li>
          <li><a href="#"><span className="badge">P</span> Proteomics IV: Basal Cell Surface Proteomes</a></li>
          <li><a href="#"><span className="badge">S</span> Signaling I: Ligand-Induced pAKT Profiles</a></li>
          <li><a href="#"><span className="badge">S</span> Signaling II: Ligand-Induced pERK Profiles</a></li>
          <li><a href="#"><span className="badge">G</span> Growth I: Small Molecule Dose Responses</a></li>
          <li><a href="#"><span className="badge">G</span> Growth II: Density-Dependent Small Molecule Dose Responses</a></li>
          <li><a href="#"><span className="badge">M</span> Morphology I: Basal and Small Molecule-Induced Features</a></li>

          <Link to="/Cell/Cube" className="btn btn-lg btn-default" role="button">Cube</Link>

          {this.props.children}
        </ul>
    </div>
    );
  }
}
