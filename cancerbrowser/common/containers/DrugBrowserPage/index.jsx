import React from 'react';
import { connect } from 'react-redux';
import PageLayout from '../../components/PageLayout';

import {
  fetchDrugsIfNeeded,
  changeDrugView
} from '../../actions/drug';

const propTypes = {
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object,
  filteredDrugs: React.PropTypes.array,
  activeFilters: React.PropTypes.object,
  drugView: React.PropTypes.string,
  drugCounts: React.PropTypes.object
};

const defaultProps = {
  drugView: 'summary'
};

function mapStateToProps(state) {
  return {
    drugView: state.drugs.drugView,
    filteredDrugs: state.drugs.filtered,
    activeFilters: state.filters.active,
    drugCounts: state.drugs.counts
  };
}

/**
 * Container component for contents of Drug Browser page content.
 */
class DrugBrowserPage extends React.Component {

  /**
   * Callback function called after this component has been mounted.
   */
  componentDidMount() {
    this.props.dispatch(fetchDrugsIfNeeded({}, {}));
  }

  /**
   * Render out JSX for DrugBrowserPage.
   * @return {ReactElement} JSX markup.
   */
  render() {

    console.log(this.props.filteredDrugs);
    return (
      <PageLayout className="DrugBrowserPage">
        <h1>Drugs</h1>
      </PageLayout>
    );
  }
}

DrugBrowserPage.defaultProps = defaultProps;
DrugBrowserPage.propTypes = propTypes;

export default connect(mapStateToProps)(DrugBrowserPage);
