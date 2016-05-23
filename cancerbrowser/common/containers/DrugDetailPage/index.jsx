import React from 'react';

const propTypes = {
  params: React.PropTypes.object
};

/**
 * Container component for contents of Company page content.
 */
class DrugDetailPage extends React.Component {

  /**
   * Callback function called after this component has been mounted.
   */
  componentDidMount() {
    // do something with this.props.params.drugId
  }

  /**
   * Render out JSX for DrugDetailPage.
   * @return {ReactElement} JSX markup.
   */
  render() {
    return (
      <div className='Drug'>
        <h1>DrugDetailPage {this.props.params.drugId}</h1>
      </div>
    );
  }
}

DrugDetailPage.propTypes = propTypes;

export default DrugDetailPage;
