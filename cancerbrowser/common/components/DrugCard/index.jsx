import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import shallowCompare from 'react-addons-shallow-compare';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { Icon } from 'react-fa';


import './drug_card.scss';

const propTypes = {
  /** A drug object */
  data: React.PropTypes.object
};

const defaultProps = {
};


/** Render a single drug card */
class DrugCard extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { data } = this.props;

    return (
      <div className='DrugCard'>
        {`[${data.name.value}]`}
      </div>
    );
  }
}

DrugCard.propTypes = propTypes;
DrugCard.defaultProps = defaultProps;

export default DrugCard;
