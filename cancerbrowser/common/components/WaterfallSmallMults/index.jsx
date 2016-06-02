
import React from 'react';

import SmallWaterfallPlot from './SmallWaterfallPlot';

const propTypes = {
  datasets: React.PropTypes.array,
  dataExtent: React.PropTypes.array,
  highlightId: React.PropTypes.string,
  activeLeft: React.PropTypes.string,
  activeRight: React.PropTypes.string,
  onChangeActive: React.PropTypes.func
};

/**
 * Encapsulates small multiples for waterfall plots
 */
class WaterfallSmallMults extends React.Component {


  constructor(props) {
    super(props);
  }

 /**
  * Render the small waterfall
  */
  renderSmallMult(dataset) {
    const { highlightId, onChangeActive, activeLeft, activeRight, dataExtent } = this.props;
    const active = (dataset.id === activeLeft || dataset.id === activeRight);
    return (
      <SmallWaterfallPlot
        key={dataset.id}
        dataset={dataset}
        onClick={this.onClick}
        dataExtent={dataExtent}
        highlightId={highlightId}
        isActive={active}
        onChangeActive={onChangeActive} />
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
