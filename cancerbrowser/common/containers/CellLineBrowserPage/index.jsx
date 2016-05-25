import React from 'react';
import { connect } from 'react-redux';
import 'react-select/dist/react-select.css';
import FilterPanel from '../../components/FilterPanel';
import PageLayout from '../../components/PageLayout';
import CellLineTable from '../../components/CellLineTable';

import {
  fetchCellLinesIfNeeded,
  changeCellLineView
} from '../../actions/cell_line';

import {
  changeActiveFilters
} from '../../actions/filter';

const propTypes = {
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object,
  filteredCellLines: React.PropTypes.array,
  activeFilters: React.PropTypes.object,
  cellLineView: React.PropTypes.string
};

function mapStateToProps(state) {
  return {
    cellLineView: state.cellLines.cellLineView,
    filteredCellLines: state.cellLines.filtered,
    activeFilters: state.filters.active
  };
}

// temporarily put these here to test until the api is set up to get them.
const cellLineFilters = [
  {
    id: 'collection',
    label: 'Collection',
    type: 'multi-select',
    values: [
      { value: 'big6', label: 'Big 6' },
      { value: 'icbp43', label: 'ICBP43' }
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
    values: [
      { value: 'basal', label: 'Basal' },
      { value: 'basala', label: 'Basal A' },
      { value: 'basalb', label: 'Basal B' },
      { value: 'luminal', label: 'Luminal' },
      { value: 'claudinlow', label: 'Low Claudin Status' }
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
    id: 'malignancy',
    label: 'Malignancy Status',
    type: 'multi-select',
    values: [
      { value: 'malignant', label: 'Malignant' },
      { value: 'nonmalignant', label: 'Non-malignant' }
    ]
  }, {
    id: 'dataset',
    label: 'Dataset',
    type: 'multi-select',
    values: [
      { value: 'dataset1', label: 'Basal Receptor (RTK) Profile' },
      { value: 'dataset2', label: 'Growth Factor-Induced pAKT/pERK Response' },
      { value: 'dataset3', label: 'Basal Total Protein Mass Spectrometry' },
      { value: 'dataset4', label: 'Basal Phosphoprotein Mass Spectrometry' },
      { value: 'dataset5', label: 'Drug Dose-Response Growth Rate Profiling' }
    ],
    options: {
      props: {
        autocompleteThreshold: 0
      }
    }
  }
];

class CellLineBrowserPage extends React.Component {
  constructor(props) {
    super(props);

    this.onFilterChange = this.onFilterChange.bind(this);
    this.onCellLineViewChange = this.onCellLineViewChange.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchCellLinesIfNeeded());
  }

  onFilterChange(newFilters) {
    this.props.dispatch(changeActiveFilters(newFilters));
    this.props.dispatch(fetchCellLinesIfNeeded(newFilters));
  }

  onCellLineViewChange(evt) {
    const newView = evt.target.value;
    this.props.dispatch(changeCellLineView(newView));
  }

  renderSidebar() {
    const filterGroups = [{
      id: 'cellLineFilters',
      label: 'Cell Line Filters',
      filters: cellLineFilters
    }];

    const counts = {
      cellLineFilters: {
        collection: {
          counts: {
            big6: 6,
            icbp43: 43
          },
          countMax: 43
        }
      }
    };

    return (
      <FilterPanel
        filterGroups={filterGroups}
        activeFilters={this.props.activeFilters}
        counts={counts}
        onFilterChange={this.onFilterChange} />
    );
  }

  renderTable() {
    const { filteredCellLines, cellLineView } = this.props;

    return (
      <div>
        <div className='form-inline'>
          <select className='form-control' onChange={this.onCellLineViewChange}>
            <option value='summary'>Summary</option>
            <option value='mutations'>Mutation Status</option>
            <option value='datasets'>Datasets</option>
          </select>
        </div>
        <CellLineTable data={filteredCellLines} view={cellLineView} />
      </div>
    );
  }

  render() {

    return (
      <PageLayout className="page-with-sidebar page CellLineBrowserPage" sidebar={this.renderSidebar()}>
        <h1>Cell</h1>
        {this.renderTable()}
      </PageLayout>
    );
  }
}

CellLineBrowserPage.propTypes = propTypes;

export default connect(mapStateToProps)(CellLineBrowserPage);
