import d3 from 'd3';

const receptorStatusColors = ['#f6578e', '#fda91f', '#54a3ff', '#7ed321'];

function lighten(color, amount) {
  const hsl = d3.rgb(color).hsl();
  hsl.l = Math.min(1, hsl.l * amount);
  return hsl.toString();
}

export const colorScales = {
  // receptor status colors
  cellLineReceptorStatus: d3.scale.ordinal()
    .domain(['nm', 'her2amp', 'tnbc', 'hr+'])
    .range(receptorStatusColors),

  // lighter receptor status colors
  cellLineReceptorStatusLighter: d3.scale.ordinal()
    .domain(['nm', 'her2amp', 'tnbc', 'hr+'])
    .range(receptorStatusColors.map(color => lighten(color, 1.4))),

  // molecular subtype colors
  cellLineMolecularSubtype: d3.scale.ordinal()
    .domain(['nonmalignantbasal', 'luminal', 'basala', 'claudinlowbasalb'])
    .range(['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4']),

  // generic multiple categories colors
  categories: d3.scale.ordinal()
    .range(['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'])
};

