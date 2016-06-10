import d3 from 'd3';

const receptorStatusColors = ['#c85f61', '#4dab9b', '#ca7832', '#7da245'];

const molecularSubtypeColors = ['#49b4be', '#cb645f', '#6ba463', '#b2973a'];


/**
 * Helper function to light a color
 * @param {String} color Hex value of color
 * @param {Number} amount Amount to ligthen by
 */
function lighten(color, amount) {
  const hsl = d3.rgb(color).hsl();
  hsl.l = Math.min(1, hsl.l * amount);
  return hsl.toString();
}

/**
 * Color scales shared across the site
 */
export const colorScales = {
  // receptor status colors
  cellLineReceptorStatus: d3.scale.ordinal()
    .domain(['nm', 'her2amp', 'tnbc', 'hrplus'])
    .range(receptorStatusColors),

  // lighter receptor status colors
  cellLineReceptorStatusLighter: d3.scale.ordinal()
    .domain(['nm', 'her2amp', 'tnbc', 'hrplus'])
    .range(receptorStatusColors.map(color => lighten(color, 1.4))),

  // molecular subtype colors
  cellLineMolecularSubtype: d3.scale.ordinal()
    .domain(['nonmalignantbasal', 'luminal', 'basala', 'claudinlowbasalb'])
    .range(molecularSubtypeColors),

  cellLineMolecularSubtypeLighter: d3.scale.ordinal()
    .domain(['nonmalignantbasal', 'luminal', 'basala', 'claudinlowbasalb'])
    .range(molecularSubtypeColors.map(color => lighten(color, 1.4))),

  // generic multiple categories colors
  categories: d3.scale.ordinal()
    .range(['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'])
};
