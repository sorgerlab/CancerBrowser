import { createSelector } from 'reselect';
import { filterData, countMatchedFilterGroup } from '../api/util';

/////////////////////
// Input Selectors
/////////////////////
function getCellLines(state) {
  return state.cellLines.items;
}

/* allow overriding the default filters location
 *
 * @param {Object} state The Redux state
 * @param {Object} substate A subsection of the Redux state to browse if provided instead
 * @return The active filters
 */
function getActiveFilters(state, substate) {
  if (substate) {
    return substate.activeFilters;
  }

  return state.filters.active;
}

/////////////////////
// Helpers
/////////////////////

// The shared filter group definition
export const cellLinesFilterGroup = {
  id: 'cellLineFilters',
  label: 'Cell Line Filters',
  filters: [
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
  ]
};

/////////////////////
// Selectors
/////////////////////

export const getFilteredCellLines = createSelector(
  [ getCellLines, getActiveFilters ],
  (cellLines, activeFilters) => {
    const activeCellLineFilters = activeFilters.cellLineFilters;
    const filteredCellLines = filterData(cellLines, activeCellLineFilters);

    return filteredCellLines;
  }
);

export const getFilteredCellLineCounts = createSelector(
  [ getFilteredCellLines ],
  (filteredCellLines) => {
    const filterGroup = cellLinesFilterGroup;
    const counts = countMatchedFilterGroup(filteredCellLines, filterGroup);

    return { cellLineFilters: counts };
  }
);
