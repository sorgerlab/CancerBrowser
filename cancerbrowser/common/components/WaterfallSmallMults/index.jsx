
import React from 'react';
import { sortByKey } from '../../utils/sort';

import SmallWaterfallPlot from './SmallWaterfallPlot';

const propTypes = {
  datasets: React.PropTypes.array,
  dataExtent: React.PropTypes.array,
  highlightId: React.PropTypes.string,
  toggledId: React.PropTypes.string,
  activeIds: React.PropTypes.array,
  onChangeActive: React.PropTypes.func
};

const defaultProps = {
  activeIds: []
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
    const { highlightId, toggledId, onChangeActive, activeIds, dataExtent } = this.props;
    const active = activeIds.includes(dataset.id);
    return (
      <SmallWaterfallPlot
        key={dataset.id}
        dataset={dataset}
        onClick={this.onClick}
        dataExtent={dataExtent}
        highlightId={highlightId}
        toggledId={toggledId}
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
        {this.props.datasets.sort(sortByKey('id')).map((d) => this.renderSmallMult(d) )}
      </div>
    );
  }
}

WaterfallSmallMults.propTypes = propTypes;
WaterfallSmallMults.defaultProps = defaultProps;

export default WaterfallSmallMults;
