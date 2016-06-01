
import React from 'react';

import SmallWaterfallPlot from './SmallWaterfallPlot';

const propTypes = {
  datasets: React.PropTypes.array,
  activeKey: React.PropTypes.string
};

/**
 * Encapsulates small multiples for waterfall plots
 */
class WaterfallSmallMults extends React.Component {


  constructor(props) {
    super(props);


    this.onClick = this.onClick.bind(this);
  }

  onClick(id) {
    console.log(id);
  }

 /**
  * Render the small waterfall
  */
  renderSmallMult(dataset) {
    return (
      <SmallWaterfallPlot
        key={dataset.id}
        dataset={dataset}
        onClick={this.onClick}
        dataExtent={[-6,1]}
        activeKey={'insr'} />
    );
  }

 /**
  * Render Component
  */
  render() {
    return (
      <div>
        {this.props.datasets.map((d) => this.renderSmallMult(d) )}
      </div>
    );
  }
}

WaterfallSmallMults.propTypes = propTypes;

export default WaterfallSmallMults;
