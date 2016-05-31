import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { Icon } from 'react-fa';

import './dataset_selector.scss';

const propTypes = {
  /** Array of datasets [{value, label}] to render in the list */
  datasets: React.PropTypes.object
};

const defaultProps = {
  bsSize: 'sm',
  bsStyle: 'default',
  pullRight: true
};

// needed for accessibility
let datasetSelectorId = 0;

/** A way to render options in react-select that includes a bar and count */
class DatasetSelector extends React.Component {
  constructor(props) {
    super(props);
    this.id = datasetSelectorId++;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { datasets, ...other } = this.props;
    // only show the dropdown if data is available
    if (!datasets || !datasets.length) {
      return null;
    }

    // show a dropdown button with all datasets that are available
    return (
      <DropdownButton
          {...other}
          className='DatasetSelector'
          id={`dataset-dropdown-${this.id}`} // ID is apparently needed for accessibility
          title={(
            <span className='dataset-dropdown'>
              <span className='dataset-count'>{datasets.length}</span>
              <Icon name='bar-chart' title='Explore Datasets' />
            </span>)}>
        {datasets.map((dataset, i) => <MenuItem key={i} eventKey={dataset.value}>{dataset.label}</MenuItem>)}
      </DropdownButton>
    );
  }
}

DatasetSelector.propTypes = propTypes;
DatasetSelector.defaultProps = defaultProps;

export default DatasetSelector;
