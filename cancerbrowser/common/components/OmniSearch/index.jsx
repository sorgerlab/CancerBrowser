import React from 'react';
import Autosuggest from 'react-autosuggest';
import shallowCompare from 'react-addons-shallow-compare';

import _ from 'lodash';

import './omni_search.scss';

const propTypes = {
  cellLines: React.PropTypes.array,
  drugs: React.PropTypes.array
};

const contextTypes = {
  router: React.PropTypes.object
};


/**
 * Omni Search component.
 */
class OmniSearch extends React.Component {

  /**
  * constructor sets up search value.
  */
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      maxResultsPerSection: 3,
      combinedData: [],
      suggestions: []
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.renderSectionTitle = this.renderSectionTitle.bind(this);
    this.getSectionSuggestions = this.getSectionSuggestions.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.cellLines && nextProps.drugs &&
      (nextProps.cellLines !== this.props.cellLines || nextProps.drugs !== this.props.drugs)) {
      const newState = {};
      Object.assign(newState, {
        combinedData: [
          {
            label: 'Cell Lines',
            id: 'cell_line',
            searchAttrs: ['id'],
            values: nextProps.cellLines
          },
          {
            label: 'Drugs',
            id: 'drug',
            searchAttrs: ['id'],
            values: nextProps.drugs
          }
        ]
      });
      Object.assign(newState, {suggestions: this.getSuggestions('')});
      this.setState(newState);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  /**
  * callback for modification of search input
  * @param {Object} event change event
  * @param {String} newValue
  */
  onChange(event, {newValue}) {
    this.setState({
      value: newValue
    });
  }

  /**
  * callback for suggestion selection
  * @param {Object} event change event
  * @param {String} suggestion The suggestion object selected
  */
  onSuggestionSelected(event, {suggestion, sectionIndex}) {
    this.setState({value: ''});
    const suggestionId = suggestion.id;
    const suggestionType = this.state.combinedData[sectionIndex].id;
    const path = `/${suggestionType}/${suggestionId}`;
    this.context.router.push(path);
  }

  /**
  * Extracts search results from combined data
  * @return {String} search term we are searching for
  */
  getSuggestions(search) {
    search = search.trim().toLowerCase();

    if(search.length > 0) {

      return this.state.combinedData.map(function(data) {
        var filteredData = _.clone(data);
        filteredData.values = filteredData.values.filter(function(value) {
          var found = false;
          data.searchAttrs.forEach(function(attr) {
            if(value[attr].toLowerCase().includes(search)) {
              found = true;
            }
          });
          return found;
        });

        return filteredData;
      });

    } else {
      return [];
    }
  }

  /**
  * Extracts subsection of nested search results
  * @param {Object} section
  * @return {Array} array of search result groups
  */
  getSectionSuggestions(section) {
    return section.values.slice(0, this.state.maxResultsPerSection);
  }

  /**
  * When suggestion is selected, this function tells
  * what should be the value of the input.
  * @param {Object} suggestion Suggestion selected
  */
  getSuggestionValue(suggestion) {
    return suggestion.id;
  }

  /**
  * Callback when search input is changed.
  * @param {String} value New search value
  */
  onSuggestionsUpdateRequested({ value }) {
    // const term = value.trim().toLowerCase();
    this.setState({
      suggestions: this.getSuggestions(value)
    });

  }

  /**
  * render section header
  * @param {Object} section Section of search suggestions
  */
  renderSectionTitle(section) {
    return (
      <strong>{section.label}</strong>
    );
  }

  /**
  * render suggestion
  * @param {Object} suggestion Suggestion object to display
  */
  renderSuggestion(suggestion) {
    return (
      <span>{suggestion.id}</span>
    );
  }

  /**
   * Render out JSX for Search.
   * @return {ReactElement} JSX markup.
   */
  render() {
    const { value, suggestions } = this.state;
    // const suggestions = this.getSuggestions(value);
    const inputProps = {
      placeholder: 'Search for a cell line or drug',
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        multiSection={true}
        focusInputOnSuggestionClick={false}
        renderSectionTitle={this.renderSectionTitle}
        getSectionSuggestions={this.getSectionSuggestions}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    );

  }
}

OmniSearch.propTypes = propTypes;
OmniSearch.contextTypes = contextTypes;
export default OmniSearch;
