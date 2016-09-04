import React from 'react';
import Mailto from 'react-mailto';

class FeedbackMailto extends React.Component {

  render() {
    return (

      <Mailto
      obfuscate={true}
      email="lincs-feedback@hms.harvard.edu"
      headers={{'subject': 'Breast Cancer Browser'}}>

      lincs-feedback [at] hms.harvard.edu

      </Mailto>

    );
  }

}

export default FeedbackMailto;
