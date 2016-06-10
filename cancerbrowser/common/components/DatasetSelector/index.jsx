import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { Icon } from 'react-fa';

import './dataset_selector.scss';

const propTypes = {
  /* Array of datasets [{value, label}] to render in the list */
  datasets: React.PropTypes.array,
  entityId: React.PropTypes.string,
  entityType: React.PropTypes.string
};

const contextTypes = {
  router: React.PropTypes.object
};

const defaultProps = {
  bsSize: 'sm',
  bsStyle: 'default',
  pullRight: true
};

// needed for accessibility
let datasetSelectorId = 0;

/**
 * Componet to render options in a react-select
 * component that includes a bar and count.
 */
class DatasetSelector extends React.Component {
  constructor(props) {
    super(props);
    this.id = datasetSelectorId++;

    this.handleDatasetSelect = this.handleDatasetSelect.bind(this);
  }

  /**
   * Life cycle method to check if component needs to be updated
   */
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  /**
   * Callback when data select button is clicked
   * @param {String} datasetId dataset id.
   */
  handleDatasetSelect(datasetId) {
    const { entityId, entityType } = this.props;
    let path = `/dataset/${datasetId}`;
    if (entityId) {
      path +=`/${entityId}`;
    }
    if (entityType) {
      path +=`/${entityType}`;
    }
    this.context.router.push(path);
  }

  /**
   * Main render method
   */
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
          onSelect={this.handleDatasetSelect}
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

DatasetSelector.contextTypes = contextTypes;
DatasetSelector.propTypes = propTypes;
DatasetSelector.defaultProps = defaultProps;

export default DatasetSelector;
