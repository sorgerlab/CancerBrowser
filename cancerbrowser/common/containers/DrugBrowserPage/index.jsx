import React from 'react';

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
      <div className='DrugBrowser'>
      </div>
    );
  }
}

DrugBrowserPage.propTypes = propTypes;

export default DrugBrowserPage;
