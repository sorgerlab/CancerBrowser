import React from 'react';
import classNames from 'classnames';
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

  renderDrugClass(drugClass) {
    if (!drugClass) {
      return null;
    }

    const classLetter = drugClass.value.charAt(0);

    return (
      <div className='drug-class'>{classLetter}</div>
    );
  }

  renderDrugDetails(data) {
    const target = data.nominalTarget && data.nominalTarget.label || 'Target';

    return (
      <div className='drug-details'>
        <div className='drug-name'>
          <Link to={`/drugs/${data.id}`}>{data.name.label}</Link>
        </div>
        <div className='drug-target'>
          {target}
        </div>
        <div className='drug-datasets'>
          <Icon name='bar-chart'/>
        </div>
      </div>
    );
  }

  render() {
    const { data } = this.props;

    console.log(data.class);

    return (
      <div className='DrugCard'>
        <div className='drug-diagram'/>
        {this.renderDrugClass(data.class)}
        {this.renderDrugDetails(data)}
      </div>
    );
  }
}

DrugCard.propTypes = propTypes;
DrugCard.defaultProps = defaultProps;

export default DrugCard;
