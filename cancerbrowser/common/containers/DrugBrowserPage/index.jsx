import React from 'react';
import CellLineTable from '../../components/CellLineTable';
import PageLayout from '../../components/PageLayout';

const propTypes = {
};

/**
 * Container component for contents of Company page content.
 */
class DrugBrowserPage extends React.Component {

  /**
   * Callback function called after this component has been mounted.
   */
  componentDidMount() {
    // do something with this.props.params.drugId
  }

  /**
   * Render out JSX for DrugBrowserPage.
   * @return {ReactElement} JSX markup.
   */
  render() {
    return (
      <PageLayout className="DrugBrowserPage">
        <h1>Drugs</h1>
        <CellLineTable />
      </PageLayout>
    );
  }
}

DrugBrowserPage.propTypes = propTypes;

export default DrugBrowserPage;
