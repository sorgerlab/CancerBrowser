import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import * as StringUtils from '../../utils/string_utils';
import DrugCard from '../DrugCard';

import './drug_cards.scss';

const propTypes = {
  /* An array of drugs to render as table rows */
  data: React.PropTypes.array,

  /* Key in the data by which to group the cards */
  groupBy: React.PropTypes.string
};

const defaultProps = {
  groupBy: 'developmentStage'
};

/**
 * Groups data by the groupBy key, expecting the value
 * to be  { value, label }.
 *
 * @param {Array} data The items to group
 * @param {String} groupBy The key to group by
 * @return {Object} The grouped items map
 */
function labelValueGroupBy(data, groupBy) {
  return data.reduce((grouped, d) => {
    const groupByValue = d[groupBy];
    let groupKey;
    if (groupByValue && groupByValue.value) {
      groupKey = groupByValue.value;
    } else {
      groupKey = 'unknown';
    }

    if (!grouped[groupKey]) {
      grouped[groupKey] = [d];
    } else {
      grouped[groupKey].push(d);
    }

    return grouped;
  }, {});
}

function groupDrugs(data, groupBy) {
  return labelValueGroupBy(data, groupBy);
}


function matchLabel(queryRegex, labeledItem) {
  const normalizedLabel =  StringUtils.normalize(labeledItem && labeledItem.label);
  if (queryRegex.test(normalizedLabel)) {
    return true;
  }

  return false;
}

/**
 * Returns true if the drug matches the search query, otherwis false
 */
function matchDrug(query, drug) {
  const normalizedQuery = StringUtils.normalize(query);

  // if we have no query, then everything is in.
  if (!normalizedQuery.length) {
    return true;
  }

  const queryRegex = RegExp(normalizedQuery);

  // check if the name matches
  if (matchLabel(queryRegex, drug.name)) {
    return true;
  }

  // check if a synonym matches
  const synonymMatch = drug.synonyms.some(synonym => queryRegex.test(StringUtils.normalize(synonym)));
  if (synonymMatch) {
    return true;
  }

  // check if a search only index key matches
  // searchIndexOnlyNames
  const searchNameMatch = drug.searchIndexOnlyNames.some(searchName => queryRegex.test(StringUtils.normalize(searchName)));
  if (searchNameMatch) {
    return true;
  }

  // check if targets match
  if (matchLabel(queryRegex, drug.targetGene) || matchLabel(queryRegex, drug.targetRole) ||
      matchLabel(queryRegex, drug.targetPathway) || matchLabel(queryRegex, drug.targetFunction)) {
    return true;
  }

  return false;
}

/**
 * Get the group header based on the label in an object in the group
 */
function groupHeader(group, groupBy) {
  const drug = group[0];
  if (drug && drug[groupBy] && drug[groupBy].label) {
    return drug[groupBy].label;
  }

  return 'Unknown';
}

/**
 * Render all the filtered drugs as cards
 */
class DrugCards extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groups: groupDrugs(props.data, props.groupBy),
      search: ''
    };

    this.renderGroup = this.renderGroup.bind(this);
    this.renderSearch = this.renderSearch.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  /**
   * Life cycle method to check if component needs to be updated
   */
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  /**
   * Life cycle method. Ensure search filter is still active.
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data || nextProps.groupBy !== this.props.groupBy) {
      let data = nextProps.data;

      // re-apply existing search
      const { search } = this.state;
      if (search) {
        data = data.filter(drug => matchDrug(search, drug));
      }

      this.setState({ groups: groupDrugs(data, nextProps.groupBy) });
    }
  }

  /**
   * Callback to handle when search is updated
   */
  handleSearchChange(evt) {
    const { data, groupBy } = this.props;
    const { value } = evt.target;

    const filteredData = data.filter(drug => matchDrug(value, drug));
    this.setState({
      search: value,
      groups: groupDrugs(filteredData, groupBy)
    });
  }

  /**
   * Render Search component
   */
  renderSearch() {
    const { search } = this.state;
    return (
      <div className="search-container">
        <label className='small-label'>Search</label>
        <input
          className="form-control"
          type="search"
          value={search}
          onChange={this.handleSearchChange}
          placeholder="Search for drugs..."
        />
      </div>
    );
  }

  /**
   * Renders each group of drugs
   *
   * @param {Array} group An array of drugs
   * @param {Number} key React render key
   *
   * @return {React.Component}
   */
  renderGroup(group, key) {
    const { groupBy } = this.props;
    const { search } = this.state;

    const header = groupHeader(group, groupBy);

    return (
      <div key={key} className='card-group'>
        <header>
          <h3>
            {header}
            <span className='group-count'>{`${group.length} ${StringUtils.plural(group, 'drug')}`}</span>
          </h3>
        </header>
        <div className='card-group-cards'>
          {group.map((drug, i) => {
            return <DrugCard key={i} data={drug} searchQuery={search} />;
          })}
        </div>
      </div>
    );
  }

  /**
   * Main render function
   */
  render() {
    const { groups } = this.state;

    // sort the groups with Unknown at the end
    const orderedGroupKeys = Object.keys(groups).sort();
    const unknownIndex = orderedGroupKeys.indexOf('unknown');
    if (unknownIndex !== -1 && unknownIndex !== orderedGroupKeys.length - 1) {
      // remove unknown
      orderedGroupKeys.splice(unknownIndex, 1);

      // place at the end
      orderedGroupKeys.push('unknown');
    }

    let emptyMessage;
    if (!groups || !Object.keys(groups).length) {
      emptyMessage = <p className='empty-message'>No drugs match the set filters.</p>;
    }

    return (
      <div className='DrugCards'>
        {this.renderSearch()}
        {emptyMessage}
        {orderedGroupKeys.map((key, index) => this.renderGroup(groups[key], index))}
      </div>
    );
  }
}

DrugCards.propTypes = propTypes;
DrugCards.defaultProps = defaultProps;

export default DrugCards;
