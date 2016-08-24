import { createSelector } from 'reselect';
import { filterData, countMatchedFilterGroup } from '../api/util';
import { colorScales } from '../config/colors';

/////////////////////
// Input Selectors
/////////////////////
function getCellLines(state) {
  return state.cellLines.items;
}

/* Get the active filters
 *
 * @param {Object} state The Redux state
 * @param {Object} substate A subsection of the Redux state to browse if provided instead
 * @return {Object} The active filters
 */
function getActiveFilters(state, substate) {
  // allow overriding the default filters location
  if (substate) {
    return substate.activeFilters;
  }

  return state.cellLines.activeFilters;
}


/* Get base filters you want active filtered to be merged with (optional)
 *
 * @param {Object} state The Redux state
 * @param {Object} substate A subsection of the Redux state to browse if provided instead
 * @return The base filters
 */
function getBaseFilters(state, substate) {
  if (substate) {
    return substate.baseFilters;
  }

  return state.cellLines.activeFilters.base;
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
        { value: 'nm', label: 'NM', color: colorScales.cellLineReceptorStatus('nm') },
        { value: 'her2amp', label: 'HER2amp', color: colorScales.cellLineReceptorStatus('her2amp') },
        { value: 'tnbc', label: 'TNBC', color: colorScales.cellLineReceptorStatus('tnbc') },
        { value: 'hrplus', label: 'HR+', color: colorScales.cellLineReceptorStatus('hrplus') }
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

/**
 * A selector for getting filtered cell lines based on a combination of
 * active filters and base filters provided by the state.
 *
 * Input selectors:
 *   - getCellLines
 *   - getActiveFilters
 *   - getBaseFilters
 *
 * @return {Array} The filtered cell lines
 *
 * NOTE: we keep getBaseFilters separate from getActiveFilters so that
 * if we encode activeFilters in the URL the base filters do not show up
 * and they do not show up in the filter summary either.
 */
export const getFilteredCellLines = createSelector(
  [ getCellLines, getActiveFilters, getBaseFilters ],
  (cellLines, activeFilters, baseFilters) => {
    const activeCellLineFilters = activeFilters.cellLineFilters;
    const baseCellLineFilters = baseFilters && baseFilters.cellLineFilters;

    let cellLineFilters;

    // merge in the base ones if provided
    if (baseCellLineFilters) {
      // for simplicity, concatenate base with activeFilters excluding those that match in base
      cellLineFilters = (activeCellLineFilters || [])
        .filter(activeValues => !baseCellLineFilters.find(baseValues => baseValues.id === activeValues.id))
        .concat(baseCellLineFilters);
    } else {
      cellLineFilters = activeCellLineFilters;
    }

    const filteredCellLines = filterData(cellLines, cellLineFilters);

    return filteredCellLines;
  }
);

/**
 * A selector for the count information for a set of cell lines
 *
 * Input selectors:
 *   - getFilteredCellLines (a selector)
 *
 * @return {Object} An object defining counts for cellLineFilters
 */
export const getFilteredCellLineCounts = createSelector(
  [ getFilteredCellLines ],
  (filteredCellLines) => {
    const filterGroup = cellLinesFilterGroup;
    const counts = countMatchedFilterGroup(filteredCellLines, filterGroup);

    return { cellLineFilters: counts };
  }
);

/**
 * A selector for getting the current cell line ID from the route
 *
 * @return {String} An object of info for a single cell line
 */
const getCellLineIdFromRoute = (state, props) => props.params.cellLineId;

/**
 * A selector for a specific cell line
 *
 * Input selectors:
 *   - getCellLines
 *
 * @return {Object} An object of info for a single cell line
 */
export const getCellLine = createSelector(
  [ getCellLines, getCellLineIdFromRoute ],
  ( cellLines, cellLineId ) => cellLines.find(cellLine => cellLine.id === cellLineId)
);
