import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import './info_panel.scss';


const propTypes = {
  /* details to display*/
  details: React.PropTypes.array

};

const defaultProps = {
};

/**
 * Info Panel Component
 */
class InfoPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  renderDetail(detail) {
    return (
      <tr key={detail.label}>
        <td className="title">{detail.label}:</td>
        <td>{detail.value}</td>
      </tr>
    );
  }

  render() {

    const { details } = this.props;

    return (
      <div className="InfoPanel">
        <table>
          <tbody>
            {details.map((detail) => this.renderDetail(detail))}
          </tbody>
        </table>
      </div>
    );
  }
}

InfoPanel.propTypes = propTypes;
InfoPanel.defaultProps = defaultProps;

export default InfoPanel;
