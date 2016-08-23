import React from 'react';

import './figure.scss';

const propTypes = {
  caption: React.PropTypes.string,
  imageUrl: React.PropTypes.string,
  width: React.PropTypes.number
};

class Figure extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Main render method
   */
  render() {

    const { caption, imageUrl, width } = this.props;

    return (
      <figure>
        <figcaption>{ caption }</figcaption>
        <img src={ imageUrl } width={ width } />
      </figure>
    );

  }

}

Figure.propTypes = propTypes;

export default Figure;
