import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { Link } from 'react-router';
import shallowCompare from 'react-addons-shallow-compare';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { Icon } from 'react-fa';

import DatasetSelector from '../DatasetSelector';

import './drug_card.scss';

const propTypes = {
  /** A drug object */
  data: React.PropTypes.object
};

const defaultProps = {
};

const drugClassConfig = {
  '00-preclinical': 'P',
  '10-phase1': '1',
  '20-phase2': '2',
  '30-phase3': '3',
  '40-approved': 'A'
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

    const classLetter = drugClassConfig[drugClass.value] || '?';

    return (
      <div title={drugClass.label} className={classNames('drug-class', `drug-class-${drugClass.value}`)}>
        {classLetter}
      </div>
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
          <DatasetSelector datasets={data.datasets} />
        </div>
      </div>
    );
  }

  render() {
    const { data } = this.props;

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
