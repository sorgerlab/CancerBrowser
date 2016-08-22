import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import shallowCompare from 'react-addons-shallow-compare';

import * as StringUtils from '../../utils/string_utils';
import DatasetSelector from '../DatasetSelector';

import './drug_card.scss';

// require in the whole directory
const drugImageContext = require.context('../../assets/img/drugs');
export function drugImageUrl(drug) {
  const filename = `HMSL${drug.hmsLincsId}.png`;
  let drugUrl;
  try {
    drugUrl = drugImageContext(`./${filename}`);
  } catch (e) {
    // some drugs do not have their structure released yet.
  }

  return drugUrl;
}

const propTypes = {
  /** A drug object */
  data: React.PropTypes.object,

  /** A string representing the search query used to show searchIndexOnlyNames */
  searchQuery: React.PropTypes.string
};

const defaultProps = {
};

const developmentStageConfig = {
  '00-preclinical': 'P',
  '10-phase1': '1',
  '20-phase2': '2',
  '30-phase3': '3',
  '40-approved': 'A'
};

/**
 * Returns a name if there is a saerchIndexOnlyName in drug that matches searchQuery
 *
 * @param {Object} drug The drug data
 * @param {String} searchQuery The search string
 * @return {String} The matching name or undefined
 */
function matchSearchIndexOnlyName(drug, searchQuery) {
  const normalizedQuery = StringUtils.normalize(searchQuery);

  // do not test against an empty query.
  if (!normalizedQuery.length) {
    return null;
  }

  const queryRegex = RegExp(normalizedQuery);
  return drug.searchIndexOnlyNames.find(searchName => queryRegex.test(StringUtils.normalize(searchName)));
}

/**
 * Returns true if the drug has synonyms or a matching hidden name
 */
function hasVisibleSynonyms(drug, searchQuery) {
  return (drug.synonyms.length || matchSearchIndexOnlyName(drug, searchQuery));
}

function getMostSpecificTarget(drug) {
  return drug.targetGene || drug.targetRole || drug.targetPathway || drug.targetFunction;
}

/** Render a single drug card */
class DrugCard extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  /**
   * Renders the development stage badge (Preclinical, phase1, etc)
   *
   * @return {React.Component}
   */
  renderDevelopmentStage(developmentStage) {
    if (!developmentStage) {
      return null;
    }

    const stageLetter = developmentStageConfig[developmentStage.value] || '?';

    return (
      <div title={developmentStage.label}
           className={classNames('drug-stage', `drug-stage-${developmentStage.value}`)}>
        {stageLetter}
      </div>
    );
  }

  /**
   * Renders the drug name, target and dataset selector
   *
   * @return {React.Component}
   */
  renderDrugDetails(data) {
    const target = getMostSpecificTarget(data);

    return (
      <div className='drug-details'>
        <div className='drug-name'>
          <Link to={`/drug/${data.id}`}>{data.name.label}</Link>
        </div>
        <div className='drug-target'>
          {target && target.label}
        </div>
        <div className='drug-datasets'>
          <DatasetSelector datasets={data.dataset} bsSize='xs' entityId={data.id} entityType={'drug'} />
        </div>
      </div>
    );
  }

  /**
   * Renders the synonym bar at the bottom
   * Displays searchIndexOnlyName if it matches the searchQuery prop
   *
   * @return {React.Component}
   */
  renderSynonyms(data, searchQuery) {
    let { synonyms } = data;

    const hiddenName = matchSearchIndexOnlyName(data, searchQuery);

    if (hiddenName) {
      synonyms = [hiddenName];
    }

    if (!synonyms.length) {
      return null;
    }

    return (
      <div className='drug-synonyms'>
        {'Also known as '}
        <span className='drug-synonym'>{synonyms.join(', ')}</span>
      </div>
    );
  }

  render() {
    const { data, searchQuery } = this.props;

    const hasSynonyms = hasVisibleSynonyms(data, searchQuery);

    return (
      <div className={classNames('DrugCard', { 'has-synonyms': hasSynonyms })}>
        <div className='drug-diagram'
          style={{ backgroundImage: `url(${drugImageUrl(data)})`}} />
        {this.renderDevelopmentStage(data.developmentStage)}
        {this.renderDrugDetails(data)}
        <div className='drug-bottom-bar'>
          {hasSynonyms ? this.renderSynonyms(data, searchQuery) : null}
        </div>
      </div>
    );
  }
}

DrugCard.propTypes = propTypes;
DrugCard.defaultProps = defaultProps;

export default DrugCard;
