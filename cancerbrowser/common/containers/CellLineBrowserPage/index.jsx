import React from 'react';
import { connect } from 'react-redux';
import 'react-select/dist/react-select.css';
import FilterPanel from '../../components/FilterPanel';
import PageLayout from '../../components/PageLayout';

import {
  fetchDatasetsIfNeeded,
  fetchCellsIfNeeded,
  fetchCellsInDatasetsIfNeeded,
  changeCellFilter,
  changeCellSubtypeFilter
} from '../../actions';

const propTypes = {
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object,
  children: React.PropTypes.object,
  datasets: React.PropTypes.object,
  subtypes: React.PropTypes.object,
  cells: React.PropTypes.object,
  cellsInDatasets: React.PropTypes.object,
  cellFilter: React.PropTypes.string,
  subtypeFilter: React.PropTypes.string
};

function mapStateToProps(state) {

  const {
    isFetching: isFetchingDatasets,
    items: datasets
  } = state.datasets;

  const {
    isFetching: isFetchingCells,
    items: cells,
    subtypes: subtypes
  } = state.cells;

  const {
    isFetching: isFetchingCellsInDatasets,
    items: cellsInDatasets
  } = state.cellsInDatasets;

  const {
    cell: cellFilter,
    subtype: subtypeFilter
  } = state.cellFilter;

  return {
    datasets,
    cells,
    subtypes,
    cellsInDatasets,
    isFetchingDatasets,
    isFetchingCells,
    isFetchingCellsInDatasets,
    cellFilter,
    subtypeFilter
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
      { value: 'basalA', label: 'Basal A' },
      { value: 'basalB', label: 'Basal B' },
      { value: 'luminal', label: 'Luminal' },
      { value: 'claudin', label: 'Low Claudin Status' }
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
  constructor() {
    super();
    this.handleChangeSubtypeFilter = this.handleChangeSubtypeFilter.bind(this);
    this.handleChangeCellFilter = this.handleChangeCellFilter.bind(this);
  }

  componentDidMount() {
    const { params, dispatch } = this.props;
    dispatch(fetchDatasetsIfNeeded(params));
    dispatch(fetchCellsIfNeeded(params));
    dispatch(fetchCellsInDatasetsIfNeeded(params));
  }

  handleChangeSubtypeFilter(value) {
    const { dispatch } = this.props;
    if (value) {
      dispatch(changeCellSubtypeFilter(value.value));
    } else {
      dispatch(changeCellSubtypeFilter(undefined));
    }
  }

  handleChangeCellFilter(value) {
    const { dispatch } = this.props;
    if (value) {
      dispatch(changeCellFilter(value.value));
    } else {
      dispatch(changeCellFilter(undefined));
    }
  }

  renderSidebar() {
    const filterGroups = [{
      id: 'cellLineFilters',
      label: 'Cell Line Filters',
      filters: cellLineFilters
    }];

    const activeFilters = {
      cellLineFilters: [
        { id: 'collection', values: ['big6'] }
      ]
    };

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
      <FilterPanel filterGroups={filterGroups} activeFilters={activeFilters} counts={counts} />
    );
  }

  render() {
    const { datasets,
            cells, subtypes,
            cellsInDatasets,
            cellFilter, subtypeFilter } = this.props;

    // TODO Tidy up, this is all very messy
    // Probably a good idea to make default state for list variables to be
    // empty lists. That way there would be a lot less checking for undefined
    // variable. That will mean adding a way to check if the data should be
    // loaded other than the variable being undefined.

    let filteredCellIds;
    if (cells) {
      if (subtypeFilter) {
        filteredCellIds = Object.keys(cells).filter(cellId => {
          const cell = cells[cellId];
          return (cell.subtypes.indexOf(subtypeFilter) !== -1);
        });
      } else {
        // Do not filter out any cells
        filteredCellIds = Object.keys(cells);
      }
    }

    let subtypeOptions;
    if (subtypes) {
      subtypeOptions = Object.keys(subtypes).map(subtypeId => {
        const subtype = subtypes[subtypeId];
        return {
          value: subtypeId,
          label: subtype
        };
      });
    }

    let cellOptions;
    if (filteredCellIds) {
      cellOptions = filteredCellIds.map(cellId => {
        const cell = cells[cellId];
        return {
          value: cellId,
          label: cell.name
        };
      });
    }

    let resultingCellIds;
    if (cellFilter) {
      resultingCellIds = [cellFilter];
    } else if (filteredCellIds) {
      resultingCellIds = filteredCellIds;
    }

    let filteredDatasetIds;
    if (datasets && cellsInDatasets && (cellFilter || subtypeFilter)) {
      filteredDatasetIds = Object.keys(datasets).filter(datasetId => {
        const datasetCells = cellsInDatasets[datasetId];
        if (!datasetCells) {
          return false;
        }
        // Looks for the cells in this dataset in the major list
        // TODO This especially is not optimal, probably precalculate these
        // and serve them with the data or at least memoise
        return datasetCells.filter(datasetCell => {
          return (resultingCellIds.indexOf(datasetCell) != -1);
        }).length > 0;
      });
    }

    let resultingDatasetIds;
    if (datasets) {
      resultingDatasetIds = filteredDatasetIds || Object.keys(datasets);
    }

    let children;
    if (this.props.children) {
      children = React.cloneElement(
        this.props.children,
        {
          datasets: datasets,
          resultingDatasetIds: resultingDatasetIds,
          cells: cells,
          subtypes: subtypes,
          resultingCellIds: resultingCellIds,
          cellsInDatasets: cellsInDatasets
        }
      );
    }

    return (
      <PageLayout className="page-with-sidebar page CellLineBrowserPage" sidebar={this.renderSidebar()}>
        <h1>Cell</h1>
        {children}
      </PageLayout>
    );
  }
}

CellLineBrowserPage.propTypes = propTypes;

export default connect(mapStateToProps)(CellLineBrowserPage);
