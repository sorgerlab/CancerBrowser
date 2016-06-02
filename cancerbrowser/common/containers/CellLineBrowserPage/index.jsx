import React from 'react';
import { connect } from 'react-redux';
import 'react-select/dist/react-select.css';
import { ButtonGroup, Button } from 'react-bootstrap';
import classNames from 'classnames';

import FilterPanel from '../../components/FilterPanel';
import FilterGroupSummary from '../../components/FilterGroupSummary';
import PageLayout from '../../components/PageLayout';
import CellLineTable from '../../components/CellLineTable';

import { fetchDatasetsInfo } from '../../actions/dataset';

import {
  fetchCellLinesIfNeeded,
  changeCellLineView
} from '../../actions/cell_line';

import {
  changeActiveFilters,
  resetActiveFilters
} from '../../actions/filter';

const propTypes = {
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object,
  filteredCellLines: React.PropTypes.array,
  activeFilters: React.PropTypes.object,
  cellLineView: React.PropTypes.string,
  cellLineCounts: React.PropTypes.object,
  datasets: React.PropTypes.object
};

const defaultProps = {
  cellLineView: 'summary'
};

function mapStateToProps(state) {
  return {
    cellLineView: state.cellLines.cellLineView,
    filteredCellLines: state.cellLines.filtered,
    activeFilters: state.filters.active,
    cellLineCounts: state.cellLines.counts,
    datasets: state.datasets.info.items
  };
}

// The definition of the filter group used for the Cell Line Filters
export const cellLineFilters = [
  {
    id: 'collection',
    label: 'Collection',
    type: 'multi-select',
    values: [
      { value: 'icbp43', label: 'ICBP43' },
      { value: 'core6', label: 'Core 6' }
    ]
  }, {
    id: 'receptorStatus',
    label: 'Receptor Status',
    type: 'multi-select',
    values: [
      { value: 'nm', label: 'NM' },
      { value: 'her2amp', label: 'HER2amp' },
      { value: 'tnbc', label: 'TNBC' },
      { value: 'hrplus', label: 'HR+' }
    ]
  }, {
    id: 'molecularSubtype',
    label: 'Molecular Subtype',
    type: 'multi-select',
    values:[
      { value: 'nonmalignantbasal', label: 'Non malignant, Basal' },
      { value: 'luminal', label: 'Luminal' },
      { value: 'basala', label: 'Basal A' },
      { value: 'claudinlowbasalb', label: 'Claudin low, Basal B' }
    ]
  }, {
    id: 'mutation',
    label: 'Mutation Status',
    type: 'multi-select',
    values: [
      { value: 'brca1wt', label: 'BRCA1 WT' },
      { value: 'brca1mut', label: 'BRCA1 MUT' },
      { value: 'brca2wt', label: 'BRCA2 WT' },
      { value: 'brca2mut', label: 'BRCA2 MUT' },
      { value: 'cdh1wt', label: 'CDH1 WT' },
      { value: 'cdh1mut', label: 'CDH1 MUT' },
      { value: 'map3k1wt', label: 'MAP3K1 WT' },
      { value: 'map3k1mut', label: 'MAP3K1 MUT' },
      { value: 'mll3wt', label: 'MLL3 WT' },
      { value: 'mll3mut', label: 'MLL3 MUT' },
      { value: 'pik3cawt', label: 'PIK3CA WT' },
      { value: 'pik3camut', label: 'PIK3CA MUT' },
      { value: 'ptenwt', label: 'PTEN WT' },
      { value: 'ptenmut', label: 'PTEN MUT' },
      { value: 'tp53wt', label: 'TP53 WT' },
      { value: 'tp53mut', label: 'TP53 MUT' },
      { value: 'gata3wt', label: 'GATA3 WT' },
      { value: 'gata3mut', label: 'GATA3 MUT' },
      { value: 'map2k4wt', label: 'MAP2K4 WT' },
      { value: 'map2k4mut', label: 'MAP2K4 MUT' }
    ]
  }, {
    id: 'dataset',
    label: 'Dataset',
    type: 'multi-select',
    values: [

      { value: 'receptor_profile', label: 'Basal Receptor (RTK) Profile' },
      { value: 'growth_factor_pakt_perk', label: 'Growth Factor-Induced pAKT/pERK Response' },
      { value: 'basal_total', label: 'Basal Total Protein Mass Spectrometry' },
      { value: 'basal_phospho', label: 'Basal Phosphoprotein Mass Spectrometry' },
      { value: 'drug_dose_response', label: 'Drug Dose-Response Growth Rate Profiling' }
    ],
    options: {
      props: {
        autocompleteThreshold: 0
      }
    }
  }
];

const filterGroups = [{
  id: 'cellLineFilters',
  label: 'Cell Line Filters',
  filters: cellLineFilters
}];

class CellLineBrowserPage extends React.Component {
  constructor(props) {
    super(props);

    this.onFilterChange = this.onFilterChange.bind(this);
    this.onCellLineViewChange = this.onCellLineViewChange.bind(this);
    this.onCellLineFilterChange = this.onCellLineFilterChange.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchCellLinesIfNeeded({}, filterGroups));
    this.props.dispatch(fetchDatasetsInfo());
  }

  /*
   * Reset the active filters when leaving the page.
   * this prevents cellLineFilters set here affecting other pages
   */
  componentWillUnmount() {
    this.props.dispatch(resetActiveFilters());
  }

  onFilterChange(newFilters) {
    this.props.dispatch(changeActiveFilters(newFilters));
    this.props.dispatch(fetchCellLinesIfNeeded(newFilters, filterGroups));
  }

  onCellLineFilterChange(newCellLineFilters) {
    const { activeFilters } = this.props;
    const newActiveFilters = Object.assign({}, activeFilters, { cellLineFilters: newCellLineFilters });

    this.props.dispatch(changeActiveFilters(newActiveFilters));
    this.props.dispatch(fetchCellLinesIfNeeded(newActiveFilters, filterGroups));
  }

  onCellLineViewChange(newView) {
    this.props.dispatch(changeCellLineView(newView));
  }

  /**
   * Renders the cell line filter side bar
   *
   * @return {React.Component}
   */
  renderSidebar() {
    return (
      <FilterPanel
        filterGroups={filterGroups}
        activeFilters={this.props.activeFilters}
        counts={this.props.cellLineCounts}
        onFilterChange={this.onFilterChange} />
    );
  }

  /**
   * Renders the cell line table and view by controls
   *
   * @return {React.Component}
   */
  renderTable() {
    const { filteredCellLines, cellLineView, datasets } = this.props;

    return (
      <div>
        <div className='cell-line-view-controls'>
          <label className='small-label'>View By</label>
          <div>
            <ButtonGroup>
              <Button className={classNames({ active: cellLineView === 'summary' })}
                 onClick={this.onCellLineViewChange.bind(this, 'summary')}>
                Summary
              </Button>
              <Button className={classNames({ active: cellLineView === 'mutations' })}
                  onClick={this.onCellLineViewChange.bind(this, 'mutations')}>
                Mutation Status
              </Button>
              <Button className={classNames({ active: cellLineView === 'datasets' })}
                 onClick={this.onCellLineViewChange.bind(this, 'datasets')}>
                Datasets
              </Button>
            </ButtonGroup>
          </div>
        </div>
        <CellLineTable data={filteredCellLines} view={cellLineView} datasets={datasets} />
      </div>
    );
  }

    /**
   * Renders the filter summary for cell line filters
   *
   * @return {React.Component}
   */
  renderFilterSummary() {
    const { activeFilters } = this.props;

    const cellLineActiveFilters = activeFilters && activeFilters.cellLineFilters;
    const cellLineFilterGroup = filterGroups.find(filterGroup => filterGroup.id === 'cellLineFilters');

    return (
      <div className='cell-line-filters-summary'>
        <FilterGroupSummary
          filterGroup={cellLineFilterGroup}
          activeFilters={cellLineActiveFilters}
          onFilterChange={this.onCellLineFilterChange} />
      </div>
    );
  }

  render() {

    return (
      <PageLayout className="page-with-sidebar page CellLineBrowserPage" sidebar={this.renderSidebar()}>
        <h1>Cell Lines</h1>
        {this.renderFilterSummary()}
        {this.renderTable()}
      </PageLayout>
    );
  }
}

CellLineBrowserPage.defaultProps = defaultProps;
CellLineBrowserPage.propTypes = propTypes;

export default connect(mapStateToProps)(CellLineBrowserPage);
